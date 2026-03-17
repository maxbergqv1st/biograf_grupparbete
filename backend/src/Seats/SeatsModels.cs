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
  string? Status
);



