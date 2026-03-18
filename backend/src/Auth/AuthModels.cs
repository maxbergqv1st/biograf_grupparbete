namespace WebApp.Auth;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(string FirstName, string LastName, string Email, string Password, string? Phone);

public record VerifyEmailRequest(string Token);

public record ForgotPasswordRequest(string Email);

public record ResetPasswordRequest(string Token, string NewPassword);

public record UserDto(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string Role,
    string? Phone,
    bool IsEmailVerified
);

public record UserEntity(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string PasswordHash,
    string Role,
    string? Phone,
    bool IsActive,
    bool IsEmailVerified
);

public record RefreshTokenEntity(string TokenHash, int UserId, DateTime ExpiresAt, bool IsRevoked);

public record EmailVerificationEntity(string Token, int UserId, DateTime ExpiresAt);

public record PasswordResetEntity(string Token, int UserId, DateTime ExpiresAt, bool IsUsed);
