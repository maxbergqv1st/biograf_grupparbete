using Microsoft.AspNetCore.Http.HttpResults;

namespace WebApp.Halls;

public static class HallEndpoints
{
    public static IEndpointRouteBuilder MapHallEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v2/halls")
        .WithTags("Halls")
        .RequireCors("V2");

        group 
            .MapGet(
                "/",
                async Task<Ok<IEnumerable<HallDto>>> (
                    IHallRepository repo,
                    CancellationToken ct
                ) =>
                {
                    var halls = await repo.GetAllHallsAsync(ct);
                    return TypedResults.Ok(halls);
                }
            )
            .RequireAuth()
            .RequireRole("admin")
            .WithSummary("Get all halls")
            .WithDescription("Return all halls");

        return app;
            
    } 
}


