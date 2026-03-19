// Here you need to crete your endpoints. So, basically here you are working managing your request data and passing it to the repository,
// getting the response and send it back to the frontend. Also, we connect swagger here

using Microsoft.AspNetCore.Http.HttpResults;
using WebApp.Auth;

namespace WebApp.Screenings;

public static class ScreeningEndpoints
{
    public static IEndpointRouteBuilder MapScreeningEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v2/screenings").WithTags("Screenings").RequireCors("V2");

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
                    return screening is null
                        ? TypedResults.NotFound()
                        : TypedResults.Ok(screening);
                }
            )
            .WithSummary("Get screening by id")
            .WithDescription("Returns a screening by id");

        group
            .MapGet(
                "/by-movie-id/{id:int}",
                async Task<Ok<IEnumerable<ScreeningDto>>> (
                    int id,
                    IScreeningRepository repo,
                    CancellationToken ct
                ) =>
                {
                    var screenings = await repo.GetScreeningsByMovieIdAsync(id, ct);
                    return TypedResults.Ok(screenings);
                }
            )
            .WithSummary("Get all screenings")
            .WithDescription(
                "Returns screenings by movie id"
            );

        group
            .MapPost(
                "/",
                async Task<Ok<ScreeningDto>> (
                    CreateScreeningDto dto,
                    IScreeningRepository repo,
                    CancellationToken ct
                ) =>
                {
                    var created = await repo.CreateScreeningAsync(dto, ct);
                    return TypedResults.Ok(created);
                })
                .RequireAuth()
                .RequireRole("admin")
                .WithSummary("Create screening")
                .WithDescription(
                "Insert new screening"
            );
        return app;
    }
}
