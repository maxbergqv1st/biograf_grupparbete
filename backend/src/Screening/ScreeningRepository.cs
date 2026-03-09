// This file is used for actual database calls. So it's the place where you aggregate the data from the DB

namespace WebApp.Screenings;

public class ScreeningRepository(MySqlDataSource db) : IScreeningRepository
{
    private static LanguageDto ReadLanguage(MySqlDataReader reader) =>
        new(
            reader.GetInt32("language_id"),
            reader.GetString("language_name"),
            reader.GetString("language_code")
        );

    private static List<string> ReadGenres(MySqlDataReader reader) =>
        JsonSerializer.Deserialize<List<string>>(reader.GetString("genres")) ?? [];

    public async Task<IEnumerable<ScreeningSummaryDto>> GetScreeningsAsync(
        ScreeningQuery query,
        CancellationToken ct
    )
    {
        var sql =
            @"
              SELECT
                  m.id, m.title, m.tagline,
                  m.age_rating, m.poster_url, m.trailer_url,
                  ml.id AS language_id, ml.name AS language_name, ml.code AS language_code,
                  JSON_ARRAYAGG(g.name) AS genres
              FROM screenings m
            JOIN screening_languages ml ON m.language_id = ml.id
            LEFT JOIN screening_genres mg ON mg.screening_id = m.id
            LEFT JOIN genres g ON g.id = mg.genre_id
            WHERE
                (@search IS NULL OR m.title LIKE @search OR m.original_title LIKE @search)
                AND (@ageRating IS NULL OR m.age_rating = @ageRating)
                AND (@genre IS NULL OR EXISTS (
                    SELECT 1 FROM screening_genres mg2
                    JOIN genres g2 ON g2.id = mg2.genre_id
                    WHERE mg2.screening_id = m.id AND g2.name = @genre
                ))
            GROUP BY m.id
        ";
        await using var connection = await db.OpenConnectionAsync(ct);
        await using var cmd = connection.CreateCommand();
        cmd.CommandText = sql;
        cmd.Parameters.AddWithValue("@search", query.Search is null ? null : $"%{query.Search}%");
        cmd.Parameters.AddWithValue("@ageRating", query.AgeRating);
        cmd.Parameters.AddWithValue("@genre", query.Genre);

        var screenings = new List<ScreeningSummaryDto>();
        await using var reader = await cmd.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
        {
            screenings.Add(
                new ScreeningSummaryDto(
                    Id: reader.GetInt32("id"),
                    Title: reader.GetString("title"),
                    Tagline: reader.GetString("tagline"),
                    AgeRating: reader.GetString("age_rating"),
                    PosterUrl: reader.IsDBNull(reader.GetOrdinal("poster_url"))
                        ? null
                        : reader.GetString("poster_url"),
                    TrailerUrl: reader.IsDBNull(reader.GetOrdinal("trailer_url"))
                        ? null
                        : reader.GetString("trailer_url"),
                    Language: ReadLanguage(reader),
                    Genres: ReadGenres(reader)
                )
            );
        }
        return screenings;
    }

    public async Task<ScreeningDto> GetScreeningByIdAsync(int id, CancellationToken ct)
    {
        var sql =
            @"
              SELECT
                  m.id, m.title, m.original_title, m.tagline, m.description,
                  m.duration, m.age_rating, m.director, m.release_date,
                  m.poster_url, m.trailer_url,
                  ml.id AS language_id, ml.name AS language_name, ml.code AS language_code,
                  JSON_ARRAYAGG(g.name) AS genres
              FROM screenings m
              JOIN screening_languages ml ON m.language_id = ml.id
              LEFT JOIN screening_genres mg ON mg.screening_id = m.id
              LEFT JOIN genres g ON g.id = mg.genre_id
              WHERE m.id = @id
              GROUP BY m.id";

        await using var conn = await db.OpenConnectionAsync(ct);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = sql;
        cmd.Parameters.AddWithValue("@id", id);

        await using var reader = await cmd.ExecuteReaderAsync(ct);
        if (!await reader.ReadAsync(ct))
            return null;

        return new ScreeningDto(
            Id: reader.GetInt32("id"),
            Title: reader.GetString("title"),
            OriginalTitle: reader.IsDBNull(reader.GetOrdinal("original_title"))
                ? null
                : reader.GetString("original_title"),
            Tagline: reader.GetString("tagline"),
            Description: reader.GetString("description"),
            Duration: reader.GetInt32("duration"),
            AgeRating: reader.GetString("age_rating"),
            Director: reader.GetString("director"),
            ReleaseDate: reader.GetDateOnly("release_date"),
            PosterUrl: reader.IsDBNull(reader.GetOrdinal("poster_url"))
                ? null
                : reader.GetString("poster_url"),
            TrailerUrl: reader.IsDBNull(reader.GetOrdinal("trailer_url"))
                ? null
                : reader.GetString("trailer_url"),
            Language: ReadLanguage(reader),
            Genres: ReadGenres(reader)
        );
    }
}
