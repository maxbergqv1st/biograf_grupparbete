namespace WebApp.Bookings;


public record BookingDto(
    int Id,
    string Email,
    int ScreeningId,
    decimal Total_price,
    int User_Id
);
