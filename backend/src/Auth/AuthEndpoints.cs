using Microsoft.AspNetCore.Http.HttpResults;

namespace WebApp.Auth;

public static class AuthEndpoints
{
    private const int RefreshTokenLifeTimeDays = 7;

    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v2/auth").WithTags("Auth").RequireCors("V2");

        group.MapPost("/login",
            async Task<Results<Ok<UserDto>, UnauthorizedHttpResult>> (
                LoginRequest loginRequest,
                IAuthRepository repo,
                IJwtService jwtService,
                HttpContext context,
                CancellationToken ct
            ) =>
            {
                var user = await repo.FindUserByEmailAsync(loginRequest.Email, ct);
                if (user is null)
                    return TypedResults.Unauthorized();

                if (!Password.Verify(loginRequest.Password, user.PasswordHash))
                    return TypedResults.Unauthorized();

                var userResponse = ToUserDto(user);

                var accessToken = jwtService.GenerateAccessToken(userResponse);
                var rawRefreshToken = jwtService.GenerateRefreshToken();
                var refreshTokenHash = jwtService.HashToken(rawRefreshToken);

                var expiresAt = DateTime.UtcNow.AddDays(RefreshTokenLifeTimeDays);
                await repo.StoreRefreshTokenAsync(refreshTokenHash, user.Id, expiresAt, ct);

                SetAuthCookies(context, accessToken, rawRefreshToken, userResponse.Role);

                return TypedResults.Ok(userResponse);

            }
        ).WithSummary("Login with email and password");

        group.MapPost("/refresh", async Task<Results<Ok<UserDto>, UnauthorizedHttpResult>> (
            IAuthRepository repo,
            IJwtService jwtService,
            HttpContext context,
            CancellationToken ct
        ) =>
        {
            if (!context.Request.Cookies.TryGetValue("refresh_token", out var rawRefreshToken) || string.IsNullOrEmpty(rawRefreshToken))
                return TypedResults.Unauthorized();

            var tokenHash = jwtService.HashToken(rawRefreshToken);
            var (token, user) = await repo.GetRefreshTokenWithUserAsync(tokenHash, ct);

            if (token is null || user is null)
            {
                ClearAuthCookies(context);
                return TypedResults.Unauthorized();
            }

            await repo.RevokeRefreshTokenAsync(tokenHash, ct);

            var userResponse = ToUserDto(user);
            var newAccessToken = jwtService.GenerateAccessToken(userResponse);
            var newRawRefreshToken = jwtService.GenerateRefreshToken();
            var newRefreshTokenHash = jwtService.HashToken(newRawRefreshToken);

            var expiresAt = DateTime.UtcNow.AddDays(RefreshTokenLifeTimeDays);
            await repo.StoreRefreshTokenAsync(newRefreshTokenHash, user.Id, expiresAt, ct);

            SetAuthCookies(context, newAccessToken, newRawRefreshToken, userResponse.Role);

            return TypedResults.Ok(userResponse);
        }).WithSummary("Refresh access token");

        group.MapDelete("/logout", async Task<Ok<object>> (
            IAuthRepository repo,
            IJwtService jwtService,
            HttpContext context,
            CancellationToken ct
        ) =>
        {
            if (context.Request.Cookies.TryGetValue("refresh_token", out var rawRefreshToken)
            && !string.IsNullOrEmpty(rawRefreshToken))
            {
                var tokenHash = jwtService.HashToken(rawRefreshToken);
                await repo.RevokeRefreshTokenAsync(tokenHash, ct);
            }

            ClearAuthCookies(context);
            return TypedResults.Ok(new { message = "Logged out successfully" } as object);
        }).WithSummary("Logout and revoke refresh token");

        group.MapGet("/me", (HttpContext context) =>
        {
            var user = context.Items["auth_user"] as UserDto;
            return TypedResults.Ok(user);
        }).WithSummary("Get current authenticated user").RequireAuth();

        group.MapPost("/register",
            async Task<Results<Ok<UserDto>, Conflict<object>>> (
                RegisterRequest req,
                IAuthRepository repo,
                IJwtService jwtService,
                IEmailService emailService,
                EmailConfig emailConfig,
                HttpContext context,
                CancellationToken ct
            ) =>
            {
                if (await repo.EmailExistsAsync(req.Email, ct))
                    // TODO: Investigate in the the following issue
                    // According to OWASP it should be 200 
                    // ref: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#account-creation
                    // And I think we should send an email with something like: "Someone trying to use your email to register a new account"
                    return TypedResults.Conflict(new { message = "Registration failed" } as object);

                // TODO: Validate request
                var passwordHash = Password.Encrypt(req.Password);
                var userId = await repo.CreateUserAsync(req.FirstName, req.LastName, req.Email, passwordHash, req.Phone, ct);

                var rawToken = jwtService.GenerateRefreshToken();
                var tokenHash = jwtService.HashToken(rawToken);
                await repo.StoreEmailVerificationAsync(tokenHash, userId, DateTime.UtcNow.AddHours(24), ct);

                var verifyUrl = $"{emailConfig.FrontendUrl}/verify-email?token={rawToken}";
                try
                {
                    await emailService.SendEmailAsync(req.Email, "Verify your email",
                        $"<h2>Welcome to Filmvisarna!</h2><p>Click <a href=\"{verifyUrl}\">here</a> to verify your email address.</p>");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to send verification email: {ex.Message}");
                }

                var user = (await repo.FindUserByEmailAsync(req.Email, ct))!;
                var userResponse = ToUserDto(user);

                var accessToken = jwtService.GenerateAccessToken(userResponse);
                var rawRefreshToken = jwtService.GenerateRefreshToken();
                var refreshTokenHash = jwtService.HashToken(rawRefreshToken);

                await repo.StoreRefreshTokenAsync(refreshTokenHash, userId, DateTime.UtcNow.AddDays(RefreshTokenLifeTimeDays), ct);
                SetAuthCookies(context, accessToken, rawRefreshToken, userResponse.Role);

                return TypedResults.Ok(userResponse);
            }
        ).WithSummary("Register a new user account");

        group.MapPost("/verify-email",
            async Task<Results<Ok<object>, BadRequest<object>>> (
                VerifyEmailRequest req,
                IAuthRepository repo,
                IJwtService jwtService,
                CancellationToken ct
            ) =>
            {
                var tokenHash = jwtService.HashToken(req.Token);
                var (verification, user) = await repo.GetEmailVerificationAsync(tokenHash, ct);

                if (verification is null || user is null)
                    return TypedResults.BadRequest(new { message = "Invalid or expired verification token" } as object);

                await repo.MarkEmailVerifiedAsync(user.Id, ct);
                await repo.DeleteEmailVerificationsForUserAsync(user.Id, ct);

                return TypedResults.Ok(new { message = "Email verified successfully" } as object);
            }
        ).WithSummary("Verify email address with token");

        group.MapPost("/forgot-password",
            async Task<Ok<object>> (
                ForgotPasswordRequest req,
                IAuthRepository repo,
                IJwtService jwtService,
                IEmailService emailService,
                EmailConfig emailConfig,
                CancellationToken ct
            ) =>
            {
                var user = await repo.FindUserByEmailAsync(req.Email, ct);
                if (user is not null)
                {
                    var rawToken = jwtService.GenerateRefreshToken();
                    var tokenHash = jwtService.HashToken(rawToken);
                    await repo.StorePasswordResetTokenAsync(tokenHash, user.Id, DateTime.UtcNow.AddHours(1), ct);

                    var resetUrl = $"{emailConfig.FrontendUrl}/reset-password?token={rawToken}";
                    try
                    {
                        await emailService.SendEmailAsync(user.Email, "Reset your password",
                            $"<h2>Password Reset</h2><p>Click <a href=\"{resetUrl}\">here</a> to reset your password. This link expires in 1 hour.</p>");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to send password reset email: {ex.Message}");
                    }
                }

                return TypedResults.Ok(new { message = "If an account with that email exists, a reset link has been sent" } as object);
            }
        ).WithSummary("Request password reset email");

        group.MapPost("/reset-password",
            async Task<Results<Ok<object>, BadRequest<object>>> (
                ResetPasswordRequest req,
                IAuthRepository repo,
                IJwtService jwtService,
                CancellationToken ct
            ) =>
            {
                // TODO: Validate request
                var tokenHash = jwtService.HashToken(req.Token);
                var (resetToken, user) = await repo.GetPasswordResetTokenAsync(tokenHash, ct);

                if (resetToken is null || user is null)
                    return TypedResults.BadRequest(new { message = "Invalid or expired reset token" } as object);

                var newPasswordHash = Password.Encrypt(req.NewPassword);
                await repo.UpdateUserPasswordAsync(user.Id, newPasswordHash, ct);
                await repo.MarkPasswordResetUsedAsync(tokenHash, ct);

                return TypedResults.Ok(new { message = "Password reset successfully" } as object);
            }
        ).WithSummary("Reset password with token");

        return app;
    }

    private static UserDto ToUserDto(UserEntity user) =>
        new(user.Id, user.FirstName, user.LastName, user.Email, user.Role, user.Phone, user.IsEmailVerified);

    private static void SetAuthCookies(HttpContext context, string accessToken, string refreshToken, string role)
    {
        var isDevMode = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

        context.Response.Cookies.Append(
            "access_token",
            accessToken,
            new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Secure = !isDevMode,
                Path = "/api/v2",
                Expires = DateTime.UtcNow.AddMinutes(15)
            }
        );

        context.Response.Cookies.Append(
            "refresh_token",
            refreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Secure = !isDevMode,
                Path = "/api/v2/auth",
                Expires = DateTime.UtcNow.AddDays(RefreshTokenLifeTimeDays)
            }
        );

        context.Response.Cookies.Append(
            "role",
            role,
            new CookieOptions
            {
                HttpOnly = false,
                SameSite = SameSiteMode.Strict,
                Secure = !isDevMode,
                Path = "/",
                Expires = DateTime.UtcNow.AddDays(7)
            }
        );
    }

    private static void ClearAuthCookies(HttpContext context)
    {
        context.Response.Cookies.Delete("access_token", new CookieOptions { Path = "/api/v2" });
        context.Response.Cookies.Delete("refresh_token", new CookieOptions { Path = "/api/v2/auth" });
        context.Response.Cookies.Delete("role", new CookieOptions { Path = "/" });
    }
}