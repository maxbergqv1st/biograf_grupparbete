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
            bookings.Add(new BookingDto(
                Id: reader.GetInt32("id"),
                Email: reader.GetString("email"),
                ScreeningId: reader.GetInt32("screening_id"),
                Total_price: reader.GetDecimal("total_price"),
                User_Id: reader.IsDBNull(reader.GetOrdinal("user_id")) ? null : reader.GetInt32("user_id"),
                BookingReference: reader.GetString("booking_reference"),
                Status: reader.GetString("status")
            ));
        }
        return bookings;
    }

    public async Task<BookingResult> AddBookingAsync(CreateBookingDto dto, CancellationToken ct)
    {
        // Generate a unique booking reference, starts with FV- for FilmVisarna
        var bookingReference = "FV-" + Guid.NewGuid().ToString("N")[..10].ToUpper();

        await using var connection = await db.OpenConnectionAsync(ct);

        var bookingSql = @"
            INSERT INTO bookings (email, screening_id, total_price, user_id, booking_reference)
            VALUES (@email, @screeningId, @totalPrice, @userId, @bookingReference);
            SELECT LAST_INSERT_ID();
        ";
        await using var bookingCmd = connection.CreateCommand();
        bookingCmd.CommandText = bookingSql;
        bookingCmd.Parameters.AddWithValue("@email", dto.Email);
        bookingCmd.Parameters.AddWithValue("@screeningId", dto.ScreeningId);
        bookingCmd.Parameters.AddWithValue("@totalPrice", dto.Total_price);
        bookingCmd.Parameters.AddWithValue("@userId", dto.User_Id.HasValue ? dto.User_Id.Value : DBNull.Value);
        bookingCmd.Parameters.AddWithValue("@bookingReference", bookingReference);
        var result = await bookingCmd.ExecuteScalarAsync(ct);
        var bookingId = Convert.ToInt32(result);

        foreach (var seat in dto.Seats)
        {
            var seatSql = @"
                INSERT INTO booking_seats (booking_id, seat_id, price_category_seat_id, final_price)
                VALUES (@bookingId, @seatId, @priceCategorySeatId, @finalPrice);
            ";
            await using var seatCmd = connection.CreateCommand();
            seatCmd.CommandText = seatSql;
            seatCmd.Parameters.AddWithValue("@bookingId", bookingId);
            seatCmd.Parameters.AddWithValue("@seatId", seat.SeatId);
            seatCmd.Parameters.AddWithValue("@priceCategorySeatId", seat.PriceCategorySeatId);
            seatCmd.Parameters.AddWithValue("@finalPrice", seat.FinalPrice);
            await seatCmd.ExecuteNonQueryAsync(ct);
        }

        return new BookingResult(bookingId, bookingReference);
    }

    public async Task<bool> CancelBookingAsync(string bookingReference, CancellationToken ct)
    {
        await using var connection = await db.OpenConnectionAsync(ct);
        await using var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            UPDATE bookings SET status = 'cancelled'
            WHERE booking_reference = @ref AND status != 'cancelled'
        ";
        cmd.Parameters.AddWithValue("@ref", bookingReference);
        var rows = await cmd.ExecuteNonQueryAsync(ct);
        return rows > 0;
    }
}



