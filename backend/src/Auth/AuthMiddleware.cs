using System.Security.Claims;

namespace WebApp.Auth;

public static class AuthMiddleware
{
    public static IApplicationBuilder UseJwtAuth(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            if (context.Request.Cookies.TryGetValue("access_token", out var token) && !string.IsNullOrEmpty(token))
            {
                var jwtService = context.RequestServices.GetRequiredService<IJwtService>();
                var principal = jwtService.ValidateAccessToken(token);

                if (principal is not null)
                {
                    var user = ExtractUserFromClaims(principal);
                    context.Items["auth_user"] = user;
                }
            }

            await next(context);
        });
    }

    private static UserDto ExtractUserFromClaims(ClaimsPrincipal principal)
    {
        return new UserDto(
            Id: int.Parse(principal.FindFirstValue("sub")!),
            FirstName: principal.FindFirstValue("first_name")!,
            LastName: principal.FindFirstValue("last_name")!,
            Email: principal.FindFirstValue("email")!,
            Role: principal.FindFirstValue("role")!,
            Phone: null
        );
    }

    public static RouteHandlerBuilder RequireAuth(this RouteHandlerBuilder builder)
    {
        return builder.AddEndpointFilter(async (context, next) =>
        {
            var user = context.HttpContext.Items["auth_user"] as UserDto;
            if (user is null)
                return TypedResults.Unauthorized();

            return await next(context);
        });
    }

    public static RouteHandlerBuilder RequireRole(this RouteHandlerBuilder builder, string role)
    {
        return builder.AddEndpointFilter(async (context, next) =>
        {
            var user = context.HttpContext.Items["auth_user"] as UserDto;
            if (user is null)
                return TypedResults.Unauthorized();

            if (!string.Equals(user.Role, role, StringComparison.OrdinalIgnoreCase))
                return TypedResults.Forbid();

            return await next(context);
        });
    }
}