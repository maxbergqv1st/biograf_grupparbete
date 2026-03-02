// Here you need to implement the interface for your repository(Data base calls)
// You need to specify what method should accept (request query params, body etc), and what function will return(response body)
namespace WebApp.Movies;

public interface IMovieRepository
{
    Task<IEnumerable<MovieSummaryDto>> GetMoviesAsync(MovieQuery query, CancellationToken ct);
    Task<MovieDto?> GetMovieByIdAsync(int id, CancellationToken ct);
}
