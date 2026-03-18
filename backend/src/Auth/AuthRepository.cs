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

        return ReadUserEntity(reader);
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
                u.password, u.role, u.phone, u.is_active, u.email_verified
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

        var user = ReadUserEntity(reader);

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
        cmd.CommandText = "DELETE FROM refresh_tokens WHERE expires_at < NOW() OR is_revoked = TRUE";
        await cmd.ExecuteNonQueryAsync(ct);
    }

    public async Task<bool> EmailExistsAsync(string email, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT EXISTS(SELECT 1 FROM users WHERE email = @email)";
        cmd.Parameters.AddWithValue("@email", email);
        var result = await cmd.ExecuteScalarAsync(ct);
        return Convert.ToBoolean(result);
    }

    public async Task<int> CreateUserAsync(string firstName, string lastName, string email, string passwordHash, string? phone, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO users (first_name, last_name, email, password, phone, email_verified)
            VALUES (@firstName, @lastName, @email, @password, @phone, FALSE);
            SELECT LAST_INSERT_ID();
        ";
        cmd.Parameters.AddWithValue("@firstName", firstName);
        cmd.Parameters.AddWithValue("@lastName", lastName);
        cmd.Parameters.AddWithValue("@email", email);
        cmd.Parameters.AddWithValue("@password", passwordHash);
        cmd.Parameters.AddWithValue("@phone", (object?)phone ?? DBNull.Value);
        var result = await cmd.ExecuteScalarAsync(ct);
        return Convert.ToInt32(result);
    }

    public async Task StoreEmailVerificationAsync(string tokenHash, int userId, DateTime expiresAt, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO email_verifications (token, user_id, expires_at)
            VALUES (@token, @userId, @expiresAt)
        ";
        cmd.Parameters.AddWithValue("@token", tokenHash);
        cmd.Parameters.AddWithValue("@userId", userId);
        cmd.Parameters.AddWithValue("@expiresAt", expiresAt);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    public async Task<(EmailVerificationEntity? Verification, UserEntity? User)> GetEmailVerificationAsync(string tokenHash, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            SELECT ev.token, ev.user_id, ev.expires_at,
                u.id, u.first_name, u.last_name, u.email,
                u.password, u.role, u.phone, u.is_active, u.email_verified
            FROM email_verifications ev
            JOIN users u ON ev.user_id = u.id
            WHERE ev.token = @token AND ev.expires_at > NOW()
        ";
        cmd.Parameters.AddWithValue("@token", tokenHash);

        await using var reader = await cmd.ExecuteReaderAsync(ct);
        if (!await reader.ReadAsync(ct))
            return (null, null);

        var verification = new EmailVerificationEntity(
            Token: reader.GetString("token"),
            UserId: reader.GetInt32("user_id"),
            ExpiresAt: reader.GetDateTime("expires_at")
        );

        var user = ReadUserEntity(reader);
        return (verification, user);
    }

    public async Task MarkEmailVerifiedAsync(int userId, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "UPDATE users SET email_verified = TRUE WHERE id = @userId";
        cmd.Parameters.AddWithValue("@userId", userId);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    public async Task DeleteEmailVerificationsForUserAsync(int userId, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "DELETE FROM email_verifications WHERE user_id = @userId";
        cmd.Parameters.AddWithValue("@userId", userId);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    public async Task StorePasswordResetTokenAsync(string tokenHash, int userId, DateTime expiresAt, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO password_reset_tokens (token, user_id, expires_at)
            VALUES (@token, @userId, @expiresAt)
        ";
        cmd.Parameters.AddWithValue("@token", tokenHash);
        cmd.Parameters.AddWithValue("@userId", userId);
        cmd.Parameters.AddWithValue("@expiresAt", expiresAt);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    public async Task<(PasswordResetEntity? ResetToken, UserEntity? User)> GetPasswordResetTokenAsync(string tokenHash, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            SELECT prt.token, prt.user_id, prt.expires_at, prt.is_used,
                u.id, u.first_name, u.last_name, u.email,
                u.password, u.role, u.phone, u.is_active, u.email_verified
            FROM password_reset_tokens prt
            JOIN users u ON prt.user_id = u.id
            WHERE prt.token = @token AND prt.expires_at > NOW() AND prt.is_used = FALSE
        ";
        cmd.Parameters.AddWithValue("@token", tokenHash);

        await using var reader = await cmd.ExecuteReaderAsync(ct);
        if (!await reader.ReadAsync(ct))
            return (null, null);

        var resetToken = new PasswordResetEntity(
            Token: reader.GetString("token"),
            UserId: reader.GetInt32("user_id"),
            ExpiresAt: reader.GetDateTime("expires_at"),
            IsUsed: reader.GetBoolean("is_used")
        );

        var user = ReadUserEntity(reader);
        return (resetToken, user);
    }

    public async Task MarkPasswordResetUsedAsync(string tokenHash, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "UPDATE password_reset_tokens SET is_used = TRUE WHERE token = @token";
        cmd.Parameters.AddWithValue("@token", tokenHash);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    public async Task UpdateUserPasswordAsync(int userId, string newPasswordHash, CancellationToken ct)
    {
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "UPDATE users SET password = @password WHERE id = @userId";
        cmd.Parameters.AddWithValue("@password", newPasswordHash);
        cmd.Parameters.AddWithValue("@userId", userId);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static UserEntity ReadUserEntity(MySqlDataReader reader) => new(
        Id: reader.GetInt32("id"),
        FirstName: reader.GetString("first_name"),
        LastName: reader.GetString("last_name"),
        Email: reader.GetString("email"),
        PasswordHash: reader.GetString("password"),
        Role: reader.GetString("role"),
        Phone: reader.IsDBNull(reader.GetOrdinal("phone")) ? null : reader.GetString("phone"),
        IsActive: reader.GetBoolean("is_active"),
        IsEmailVerified: reader.GetBoolean("email_verified")
    );
}