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


        return app;
    }

    private static UserDto ToUserDto(UserEntity user) =>
        new(user.Id, user.FirstName, user.LastName, user.Email, user.Role, user.Phone);

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