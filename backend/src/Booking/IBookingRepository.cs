// Här ska task sättas. Här ska interface deklareras. Här ska kontraktet DTO, DTO DataTransferObject. // DTO definerar objektet
namespace WebApp.Bookings;

public interface IBookingRepository
{
    Task<IEnumerable<BookingDto>> GetBookingDtosAsync(int id, CancellationToken ct);
    Task<BookingResult> AddBookingAsync(CreateBookingDto dto, CancellationToken ct);
    Task<bool> CancelBookingAsync(string bookingReference, CancellationToken ct);
}