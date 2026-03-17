// Här kopplas allt ihop med Swagger. Här görs endpoints. Ska kopplas med Orval. 

// Here you need to crete your endpoints. So, basically here you are working managing your request data and passing it to the repository,
// getting the response and send it back to the frontend. Also, we connect swagger here

using Microsoft.AspNetCore.Http.HttpResults;

namespace WebApp.Bookings;

public static class BookingEndpoints
{
    public static IEndpointRouteBuilder MapBookingEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/bookings").WithTags("Bookings");

        group
            .MapGet(
                "/by-movie-id/{id:int}",
                async Task<Ok<IEnumerable<BookingDto>>> (
                    int id,
                    IBookingRepository repo,
                    CancellationToken ct
                ) =>
                {
                    var bookings = await repo.GetBookingDtosAsync(id, ct);
                    return TypedResults.Ok(bookings);
                }
            )
            .WithSummary("Get all bookings")
            .WithDescription(
                "Returns bookings by movie id"
            );
        return app;
    }
}
