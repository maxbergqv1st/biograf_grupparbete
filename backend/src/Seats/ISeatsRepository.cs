// Here you need to implement the interface for your repository(Data base calls)
// You need to specify what method should accept (request query params, body etc), and what function will return(response body)
namespace WebApp.Seats;

public interface ISeatsRepository
{
  Task<List<HallRowConfig>> GetHallRowConfigsAsync(int hallId, CancellationToken ct);
  Task<List<SeatStatus>> GetSeatStatusesAsync(int screeningId, CancellationToken ct);
  Task<bool> ReserveSeatsAsync(ReserveSeatsRequest request, CancellationToken ct);
  Task ReleaseSeatsAsync(ReleaseSeatsRequest request, CancellationToken ct);
}
