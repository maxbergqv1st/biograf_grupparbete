// This file is used for actual database calls. So it's the place where you aggregate the data from the DB

namespace WebApp.Screenings;

public class ScreeningRepository(MySqlDataSource db) : IScreeningRepository
{
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
}