namespace WebApp.Auth;

public class AuthRepository(MySqlDataSource db) : IAuthRepository
{
    public async Task<UserEntity?> FindUserByEmailAsync(string email, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM users WHERE email = @email AND is_active = TRUE";
        cmd.Parameters.AddWithValue("@email", email);

        await using var reader = await cmd.ExecuteReaderAsync(ct);
        if (!await reader.ReadAsync(ct))
            return null;

        return new UserEntity(
            Id: reader.GetInt32("id"),
            FirstName: reader.GetString("first_name"),
            LastName: reader.GetString("last_name"),
            Email: reader.GetString("email"),
            PasswordHash: reader.GetString("password_hash"),
            Role: reader.GetString("role"),
            Phone: reader.IsDBNull(reader.GetOrdinal("phone")) ? null : reader.GetString("phone"),
            IsActive: reader.GetBoolean("is_active")
        );
    }

    public async Task StoreRefreshTokenAsync(string HashToken, int userId, DateTime expiresAt, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO refresh_tokens (token_hash, user_id, expires_at)
            VALUES (@tokenHash, @userId, @expiresAt)
        ";
        cmd.Parameters.AddWithValue("@tokenHash", HashToken);
        cmd.Parameters.AddWithValue("@userId", userId);
        cmd.Parameters.AddWithValue("@expiresAt", expiresAt);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    public async Task<(RefreshTokenEntity? Token, UserEntity? User)> GetRefreshTokenWithUserAsync(string HashToken, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            SELECT rt.token_hash, rt.user_id, rt.expires_at, rt.is_revoked,
                u.id, u.first_name, u.last_name, u.email,
                u.password_hash, u.role, u.phone, u.is_active
            FROM refresh_tokens rt
            JOIN users u ON rt.user_id = u.id
            WHERE rt.token_hash = @tokenHash
                AND rt.is_revoked = FALSE
                AND rt.expires_at > NOW()
                AND u.is_active = TRUE
        ";
        cmd.Parameters.AddWithValue("@tokenHash", HashToken);

        await using var reader = await cmd.ExecuteReaderAsync(ct);
        if (!await reader.ReadAsync(ct))
            return (null, null);

        var token = new RefreshTokenEntity(
            TokenHash: reader.GetString("token_hash"),
            UserId: reader.GetInt32("user_id"),
            ExpiresAt: reader.GetDateTime("expires_at"),
            IsRevoked: reader.GetBoolean("is_revoked")
        );

        var user = new UserEntity(
            Id: reader.GetInt32("id"),
            FirstName: reader.GetString("first_name"),
            LastName: reader.GetString("last_name"),
            Email: reader.GetString("email"),
            PasswordHash: reader.GetString("password_hash"),
            Role: reader.GetString("role"),
            Phone: reader.IsDBNull(reader.GetOrdinal("phone")) ? null : reader.GetString("phone"),
            IsActive: reader.GetBoolean("is_active")
        );

        return (token, user);
    }

    public async Task RevokeRefreshTokenAsync(string tokenHash, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "UPDATE refresh_tokens SET is_revoked = TRUE WHERE token_hash = @tokenHash";
        cmd.Parameters.AddWithValue("@tokenHash", tokenHash);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    public async Task CleanupExpiredRefreshTokensAsync(CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "DELETE FROM refresh_tokens WHERE expired_at < NOW() OR is_revoked = TRUE";
        await cmd.ExecuteNonQueryAsync(ct);
    }
}