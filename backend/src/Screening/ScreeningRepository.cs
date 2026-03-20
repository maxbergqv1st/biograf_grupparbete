// This file is used for actual database calls. So it's the place where you aggregate the data from the DB

namespace WebApp.Screenings;

public class ScreeningRepository(MySqlDataSource db) : IScreeningRepository
{
    public async Task<ScreeningDto?> GetScreeningByIdAsync(int id, CancellationToken ct)
    {
        const string sql = @"
        SELECT *
        FROM screenings_by_movie_id
        WHERE id = @id
        LIMIT 1
        ";
        await using var connection = await db.OpenConnectionAsync(ct);
        await using var cmd = connection.CreateCommand();
        cmd.CommandText = sql;
        cmd.Parameters.AddWithValue("@id", id);

        await using var reader = await cmd.ExecuteReaderAsync(ct);
        if (!await reader.ReadAsync(ct))
        {
            return null;
        }

        return new ScreeningDto
        (
            Id: reader.GetInt32("id"),
            MovieId: reader.GetInt32("movie_id"),
            HallId: reader.GetInt32("hall_id"),
            HallName: reader.GetString("hall_name"),
            ScreeningDate: reader.GetDateOnly("screening_date"),
            ScreeningTime: reader.GetTimeOnly("screening_time")
        );
    }

    public async Task<IEnumerable<ScreeningDto>> GetScreeningsByMovieIdAsync(int id, CancellationToken ct)
    {
        var sql =
        @"
        SELECT * 
        FROM screenings_by_movie_id
        WHERE movie_id = @id
        ";
        await using var connection = await db.OpenConnectionAsync(ct);
        await using var cmd = connection.CreateCommand();
        cmd.CommandText = sql;
        cmd.Parameters.AddWithValue("@id", id);
        var screenings = new List<ScreeningDto>();
        await using var reader = await cmd.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
        {
            screenings.Add(new ScreeningDto
            (
                Id: reader.GetInt32("id"),
                MovieId: reader.GetInt32("movie_id"),
                HallId: reader.GetInt32("hall_id"),
                HallName: reader.GetString("hall_name"),
                ScreeningDate: reader.GetDateOnly("screening_date"),
                ScreeningTime: reader.GetTimeOnly("screening_time")
            )
            );
        }
        return screenings;
    }

    public async Task<ScreeningDto> CreateScreeningAsync(
        CreateScreeningDto dto,
        CancellationToken ct
    )
    {
        const string sql = @"
             INSERT INTO screenings (movie_id, hall_id, screening_date, screening_time)
            VALUES (@movieId, @hallId, @screeningDate, @screeningTime);

            SELECT
                s.id,
                s.movie_id,
                s.hall_id,
                h.name AS hall_name,
                s.screening_date,
                s.screening_time
            FROM screenings s
            JOIN halls h ON h.id = s.hall_id
            WHERE s.id = LAST_INSERT_ID();
        ";
        await using var connection = await db.OpenConnectionAsync(ct);
        await using var cmd = connection.CreateCommand();
        cmd.CommandText = sql;
        cmd.Parameters.AddWithValue("@movieId", dto.MovieId);
        cmd.Parameters.AddWithValue("@hallId", dto.HallId);
        cmd.Parameters.AddWithValue("@screeningDate", dto.ScreeningDate);
        cmd.Parameters.AddWithValue("@screeningTime", dto.ScreeningTime);

        await using var reader = await cmd.ExecuteReaderAsync(ct);

        if (!await reader.ReadAsync(ct))
            throw new InvalidOperationException("Failed to create screening");

        return new ScreeningDto(
            reader.GetInt32("id"),
            reader.GetInt32("movie_id"),
            reader.GetInt32("hall_id"),
            reader.GetString("hall_name"),
            reader.GetDateOnly("screening_date"),
            reader.GetTimeOnly("screening_time")
        );

    }
}
