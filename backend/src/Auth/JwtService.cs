using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace WebApp.Auth;

public class JwtService : IJwtService
{
    private readonly SymmetricSecurityKey _key;
    private readonly string _issuer;
    private readonly int _accessTokenLifetimeMinutes;

    public JwtService()
    {
        var configPath = Path.Combine(
            AppContext.BaseDirectory, "..", "..", "..", "auth-config.json");
        var json = File.ReadAllText(configPath);
        var config = JsonSerializer.Deserialize<JwtConfig>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? throw new InvalidOperationException("Failed to read auth-config.json");

        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.Secret));
        _issuer = config.Issuer;
        _accessTokenLifetimeMinutes = config.AccessTokenLifetimeMinutes;
    }

    public string GenerateAccessToken(UserDto user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new("role", user.Role),
            new("first_name", user.FirstName),
            new("last_name", user.LastName)
        };

        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

        var tokenDescription = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_accessTokenLifetimeMinutes),
            SigningCredentials = credentials,
            Issuer = _issuer
        };

        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateToken(tokenDescription);
        return handler.WriteToken(token);
    }

    public ClaimsPrincipal? ValidateAccessToken(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var validationParams = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = _key,
            ValidateIssuer = true,
            ValidIssuer = _issuer,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
        handler.MapInboundClaims = false;

        try
        {
            var principal = handler.ValidateToken(token, validationParams, out _);
            return principal;
        }
        catch
        {
            return null;
        }
    }

    public string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString();
    }

    public string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }

    private record JwtConfig(
        string Secret,
        int AccessTokenLifetimeMinutes,
        int RefreshTokenLifetimeMinutes,
        string Issuer
    );
}