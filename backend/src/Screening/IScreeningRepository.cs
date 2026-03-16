// Here you need to implement the interface for your repository(Data base calls)
// You need to specify what method should accept (request query params, body etc), and what function will return(response body)
namespace WebApp.Screenings;

public interface IScreeningRepository
{
    Task<IEnumerable<ScreeningDto>> GetScreeningsByMovieIdAsync(int id, CancellationToken ct);
    Task<ScreeningDto> CreateScreeningAsync(CreateScreeningDto dto, CancellationToken ct );
}
