namespace WebApp.Auth;

public interface IAuthRepository
{
    Task<UserEntity?> FindUserByEmailAsync(string email, CancellationToken ct);
    Task StoreRefreshTokenAsync(string token, int userId, DateTime expiresAt, CancellationToken ct);
    Task<(RefreshTokenEntity? Token, UserEntity? User)> GetRefreshTokenWithUserAsync(string tokenHash, CancellationToken ct);
    Task RevokeRefreshTokenAsync(string tokenHash, CancellationToken ct);
    Task CleanupExpiredRefreshTokensAsync(CancellationToken ct);

    Task<bool> EmailExistsAsync(string email, CancellationToken ct);
    Task<int> CreateUserAsync(string firstName, string lastName, string email, string passwordHash, string? phone, CancellationToken ct);

    Task StoreEmailVerificationAsync(string tokenHash, int userId, DateTime expiresAt, CancellationToken ct);
    Task<(EmailVerificationEntity? Verification, UserEntity? User)> GetEmailVerificationAsync(string tokenHash, CancellationToken ct);
    Task MarkEmailVerifiedAsync(int userId, CancellationToken ct);
    Task DeleteEmailVerificationsForUserAsync(int userId, CancellationToken ct);

    Task StorePasswordResetTokenAsync(string tokenHash, int userId, DateTime expiresAt, CancellationToken ct);
    Task<(PasswordResetEntity? ResetToken, UserEntity? User)> GetPasswordResetTokenAsync(string tokenHash, CancellationToken ct);
    Task MarkPasswordResetUsedAsync(string tokenHash, CancellationToken ct);
    Task UpdateUserPasswordAsync(int userId, string newPasswordHash, CancellationToken ct);
}
