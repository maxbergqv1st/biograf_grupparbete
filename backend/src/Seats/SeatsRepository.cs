// This file is used for actual database calls. So it's the place where you aggregate the data from the DB

using System.Collections.Generic;
using System.Threading;

namespace WebApp.Seats;

public class SeatsRepository : ISeatsRepository
{
  private readonly MySqlDataSource _db;

  public SeatsRepository(MySqlDataSource db)
  {
    _db = db;
  }

  public async Task<List<HallRowConfig>> GetHallRowConfigsAsync(int hallId, CancellationToken ct)
  {
    var sql = "SELECT name, number_of_seats FROM hall_row_config WHERE hall_id = @hallId ORDER BY name";
    await using var connection = await _db.OpenConnectionAsync(ct);
    await using var cmd = connection.CreateCommand();
    cmd.CommandText = sql;
    cmd.Parameters.AddWithValue("@hallId", hallId);

    var configs = new List<HallRowConfig>();
    await using var reader = await cmd.ExecuteReaderAsync(ct);
    while (await reader.ReadAsync(ct))
    {
      configs.Add(new HallRowConfig
      (
        HallId: reader.GetInt32("hallId"),
        Name: reader.GetString("name"),
        NumberOfSeats: reader.GetInt32("number_of_seats")
      )
      );

    }
    return configs;
  }
  public async Task<List<SeatStatus>> GetSeatStatusesAsync(int screeningId, CancellationToken ct)
  {
    var sql = @"
        SELECT s.id, s.row_name, s.number_in_row,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM booking_seat bs 
                JOIN booking b ON bs.booking_id = b.id 
                WHERE bs.seat_id = s.id AND b.screening_id = @screeningId
            ) THEN 'booked'
            WHEN EXISTS (
                SELECT 1 FROM seat_ghost sg 
                WHERE sg.seat_id = s.id AND sg.screening_id = @screeningId
            ) THEN 'ghost'
            ELSE 'available'
        END as status
        FROM seat s 
        WHERE s.hall_id = (SELECT hall_id FROM screening WHERE id = @screeningId)
        ORDER BY s.row_name, s.number_in_row
    ";
    await using var connection = await _db.OpenConnectionAsync(ct);
    await using var cmd = connection.CreateCommand();
    cmd.CommandText = sql;
    cmd.Parameters.AddWithValue("@screeningId", screeningId);

    var statuses = new List<SeatStatus>();
    await using var reader = await cmd.ExecuteReaderAsync(ct);
    while (await reader.ReadAsync(ct))
    {
      statuses.Add(new SeatStatus
      (
        SeatId: reader.GetInt32("id"),
        ScreeningId: reader.GetInt32("screeningId"),
        Status: reader.GetString("status")
      )
      );
    }
    return statuses;
  }

}
