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
    var sql = @"
        SELECT hall_id, name, number_of_seats
        FROM hall_row_configs
        WHERE hall_id = @hallId
        ORDER BY name
    ";
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
        HallId: reader.GetInt32("hall_id"),
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
        SELECT seat_id, row_name, number_in_row, status
        FROM screening_seat_status
        WHERE screening_id = @screeningId
        ORDER BY row_name, number_in_row
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
        SeatId: reader.GetInt32("seat_id"),
        ScreeningId: screeningId,
        Status: reader.GetString("status"),
        RowName: reader.GetString("row_name"),
        NumberInRow: reader.GetInt32("number_in_row")
      )
      );
    }
    return statuses;
  }

  public async Task<bool> ReserveSeatsAsync(ReserveSeatsRequest request, CancellationToken ct)
  {
    await using var connection = await _db.OpenConnectionAsync(ct);
    await using var transaction = await connection.BeginTransactionAsync(ct);

    try
    {
      var deleteExistingSql = @"
        DELETE FROM seat_ghosts
        WHERE screening_id = @screeningId
          AND session_id = @sessionId
      ";
      await using (var deleteCmd = connection.CreateCommand())
      {
        deleteCmd.Transaction = transaction;
        deleteCmd.CommandText = deleteExistingSql;
        deleteCmd.Parameters.AddWithValue("@screeningId", request.ScreeningId);
        deleteCmd.Parameters.AddWithValue("@sessionId", request.SessionId);
        await deleteCmd.ExecuteNonQueryAsync(ct);
      }

      foreach (var seatId in request.SeatIds.Distinct())
      {
        var availabilitySql = @"
          SELECT COUNT(*)
          FROM screening_seat_status
          WHERE screening_id = @screeningId
            AND seat_id = @seatId
            AND status <> 'available'
        ";

        await using var availabilityCmd = connection.CreateCommand();
        availabilityCmd.Transaction = transaction;
        availabilityCmd.CommandText = availabilitySql;
        availabilityCmd.Parameters.AddWithValue("@screeningId", request.ScreeningId);
        availabilityCmd.Parameters.AddWithValue("@seatId", seatId);

        var unavailableCount = Convert.ToInt32(
          await availabilityCmd.ExecuteScalarAsync(ct)
        );

        if (unavailableCount > 0)
        {
          await transaction.RollbackAsync(ct);
          return false;
        }

        var reserveSql = @"
          INSERT INTO seat_ghosts (screening_id, seat_id, session_id, reserved_at, expires_at)
          VALUES (@screeningId, @seatId, @sessionId, NOW(), DATE_ADD(NOW(), INTERVAL 2 MINUTE))
        ";

        await using var reserveCmd = connection.CreateCommand();
        reserveCmd.Transaction = transaction;
        reserveCmd.CommandText = reserveSql;
        reserveCmd.Parameters.AddWithValue("@screeningId", request.ScreeningId);
        reserveCmd.Parameters.AddWithValue("@seatId", seatId);
        reserveCmd.Parameters.AddWithValue("@sessionId", request.SessionId);
        await reserveCmd.ExecuteNonQueryAsync(ct);
      }

      await transaction.CommitAsync(ct);
      return true;
    }
    catch
    {
      await transaction.RollbackAsync(ct);
      throw;
    }
  }

  public async Task ReleaseSeatsAsync(ReleaseSeatsRequest request, CancellationToken ct)
  {
    await using var connection = await _db.OpenConnectionAsync(ct);
    await using var cmd = connection.CreateCommand();
    cmd.CommandText = @"
      DELETE FROM seat_ghosts
      WHERE screening_id = @screeningId
        AND session_id = @sessionId
    ";
    cmd.Parameters.AddWithValue("@screeningId", request.ScreeningId);
    cmd.Parameters.AddWithValue("@sessionId", request.SessionId);
    await cmd.ExecuteNonQueryAsync(ct);
  }

}
