namespace WebApp.Halls;

public class HallRepository(MySqlDataSource db) : IHallRepository
{
    public async Task<IEnumerable<HallDto>> GetAllHallsAsync(CancellationToken ct)
    {
        const string sql = @"
            SELECT id, name, type, row_count, sound_system, screen_size
            FROM hall
        ";
        await using var connection = await db.OpenConnectionAsync(ct);
        await using var cmd = connection.CreateCommand();
        cmd.CommandText = sql;

        var halls = new List<HallDto>();
        await using var reader = await cmd.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
        {
            halls.Add(new HallDto(
                Id: reader.GetInt32("id"),
                Name: reader.GetString("name"),
                Type: reader.GetInt32("type"),
                RowCount: reader.GetInt32("row_count"),
                SoundSystem: reader.GetInt32("sound_system"),
                ScreenSize: reader.GetInt16("screen_size")
            ));
        }
        return halls;
    }
}