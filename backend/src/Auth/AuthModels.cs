namespace WebApp.Auth;

public record LoginRequest(string Email, string Password);

public record UserDto(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string Role,
    string? Phone
);

public record UserEntity(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string PasswordHash,
    string Role,
    string? Phone,
    bool IsActive
);

public record RefreshTokenEntity(string TokenHash, int UserId, DateTime ExpiresAt, bool IsRevoked);