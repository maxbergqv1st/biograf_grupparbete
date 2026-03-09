// Here you need to implement the interface for your repository(Data base calls)
// You need to specify what method should accept (request query params, body etc), and what function will return(response body)
namespace WebApp.Screenings;

public interface IScreeningRepository
{
    Task<IEnumerable<ScreeningSummaryDto>> GetScreeningsAsync(ScreeningQuery query, CancellationToken ct);
    Task<ScreeningDto?> GetScreeningByIdAsync(int id, CancellationToken ct);
}
