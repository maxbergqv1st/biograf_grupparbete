// Here you need to implement the interface for your repository(Data base calls)
// You need to specify what method should accept (request query params, body etc), and what function will return(response body)
namespace WebApp.Halls;

public interface IHallRepository
{
    Task<IEnumerable<HallDto>> GetAllHallsAsync(CancellationToken ct);

}