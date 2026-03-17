// Här görs query med kontraktet DTO, DTO DataTransferObject. // DTO definerar objektet// This file is used for actual database calls. So it's the place where you aggregate the data from the DB

namespace WebApp.Bookings;

public class BookingRepository(MySqlDataSource db) : IBookingRepository
{
    public async Task<IEnumerable<BookingDto>> GetBookingDtosAsync(int id, CancellationToken ct)
    {
        var sql =
        @"
        SELECT * 
        FROM bookings
        WHERE id = @id
        ";
        await using var connection = await db.OpenConnectionAsync(ct);
        await using var cmd = connection.CreateCommand();
        cmd.CommandText = sql;
        cmd.Parameters.AddWithValue("@id", id);
        var bookings = new List<BookingDto>();
        await using var reader = await cmd.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
        {
            bookings.Add(new BookingDto
            (
                Id: reader.GetInt32("id"),
                Email: reader.GetString("email"),
                ScreeningId: reader.GetInt32("screening_id"),
                Total_price: reader.GetDecimal("total_price"),
                User_Id: reader.GetInt32("user_id")
            )
            );
        }
        return bookings;
    }
}