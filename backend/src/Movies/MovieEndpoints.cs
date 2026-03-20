// Here you need to crete your endpoints. So, basically here you are working managing your request data and passing it to the repository,
// getting the response and send it back to the frontend. Also, we connect swagger here

using Microsoft.AspNetCore.Http.HttpResults;

namespace WebApp.Movies;

public static class MovieEndpoints
{
    public static IEndpointRouteBuilder MapMovieEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v2/movies").WithTags("Movies").RequireCors("V2");

        group
            .MapGet(
                "/",
                async Task<Ok<IEnumerable<MovieSummaryDto>>> (
                    string? search,
                    string? genre,
                    string? ageRating,
                    DateOnly? screeningDate,
                    IMovieRepository repo,
                    CancellationToken ct
                ) =>
                {
                    var query = new MovieQuery(search, genre, ageRating, screeningDate);
                    var movies = await repo.GetMoviesAsync(query, ct);
                    return TypedResults.Ok(movies);
                }
            )
            .WithSummary("Get all movies")
            .WithDescription(
                "Returns all movies. Use query parameters to filter and search movies"
            );

        group
            .MapGet(
                "/{id:int}",
                async Task<Results<Ok<MovieDto>, NotFound>> (
                    int id,
                    IMovieRepository repo,
                    CancellationToken ct
                ) =>
                {
                    var movie = await repo.GetMovieByIdAsync(id, ct);
                    return movie is null ? TypedResults.NotFound() : TypedResults.Ok(movie);
                }
            )
            .WithSummary("Get movie by id");

        return app;
    }
}
