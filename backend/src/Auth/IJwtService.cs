using System.Security.Claims;

namespace WebApp.Auth;

public interface IJwtService
{
    string GenerateAccessToken(UserDto user);
    ClaimsPrincipal? ValidateAccessToken(string token);
    string GenerateRefreshToken();
    string HashToken(string token);
}