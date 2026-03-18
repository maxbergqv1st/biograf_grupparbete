namespace WebApp.Bookings;

public record BookingDto(
    int Id,
    string Email,
    int ScreeningId,
    decimal Total_price,
    int? User_Id,
    string BookingReference,
    string Status
);

public record CreateBookingDto(
    string Email,
    int ScreeningId,
    decimal Total_price,
    int? User_Id,
    string? ReservationSessionId,
    List<BookingSeatDto> Seats
);

public record BookingSeatDto(
    int SeatId,
    int PriceCategorySeatId,
    decimal FinalPrice
);

public record BookingResult(
    int Id,
    string BookingReference
);

public record CancelBookingRequest(
    string BookingReference
);
