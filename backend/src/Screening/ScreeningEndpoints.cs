// Here you need to crete your endpoints. So, basically here you are working managing your request data and passing it to the repository,
// getting the response and send it back to the frontend. Also, we connect swagger here

using Microsoft.AspNetCore.Http.HttpResults;

namespace WebApp.Screenings;

public static class ScreeningEndpoints
{
    public static IEndpointRouteBuilder MapScreeningEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/Screenings").WithTags("Screenings");

        group
            .MapGet(
                "/",
                async Task<Ok<IEnumerable<ScreeningSummaryDto>>> (
                    string? search,
                    string? genre,
                    string? ageRating,
                    IScreeningRepository repo,
                    CancellationToken ct
                ) =>
                {
                    var query = new ScreeningQuery(search, genre, ageRating);
                    var screenings = await repo.GetScreeningsAsync(query, ct);
                    return TypedResults.Ok(screenings);
                }
            )
            .WithSummary("Get all screenings")
            .WithDescription(
                "Returns all screenings. Use query parameters to filter and search screenings"
            );

        group
            .MapGet(
                "/{id:int}",
                async Task<Results<Ok<ScreeningDto>, NotFound>> (
                    int id,
                    IScreeningRepository repo,
                    CancellationToken ct
                ) =>
                {
                    var screening = await repo.GetScreeningByIdAsync(id, ct);
                    return screening is null ? TypedResults.NotFound() : TypedResults.Ok(screening);
                }
            )
            .WithSummary("Get screening by id");

        return app;
    }
}
