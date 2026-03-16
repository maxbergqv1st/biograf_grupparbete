namespace WebApp.Auth;

public interface IAuthRepository
{
    Task<UserEntity?> FindUserByEmailAsync(string email, CancellationToken ct);
    Task StoreRefreshTokenAsync(string token, int userId, DateTime expiresAt, CancellationToken ct);
    Task<(RefreshTokenEntity? Token, UserEntity? User)> GetRefreshTokenWithUserAsync(string tokenHash, CancellationToken ct);
    Task RevokeRefreshTokenAsync(string tokenHash, CancellationToken ct);
    Task CleanupExpiredRefreshTokensAsync(CancellationToken ct);
}