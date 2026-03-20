// This file is for describing the models for you data
// This file is for describing the models for you data
namespace WebApp.Seats;

public record HallRowConfig(
  int HallId,
  string Name,
  int NumberOfSeats
);

public record SeatStatus(
  int SeatId,
  int ScreeningId,
  string? Status,
  string RowName,
  int NumberInRow
);

public record ReserveSeatsRequest(
  int ScreeningId,
  string SessionId,
  List<int> SeatIds
);

public record ReleaseSeatsRequest(
  int ScreeningId,
  string SessionId
);

