// Här kopplas allt ihop med Swagger. Här görs endpoints. Ska kopplas med Orval. 

// Here you need to crete your endpoints. So, basically here you are working managing your request data and passing it to the repository,
// getting the response and send it back to the frontend. Also, we connect swagger here

using Microsoft.AspNetCore.Http.HttpResults;

namespace WebApp.Bookings;

public static class BookingEndpoints
{
    public static IEndpointRouteBuilder MapBookingEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v2/bookings").WithTags("Bookings");

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
            //.RequireAuth()
            //.RequireRole("admin")
            .WithSummary("Get all bookings")
            .WithDescription(
                "Returns bookings by movie id"
            );
        group
            .MapPost(
                "/api/v2/bookings",
                async Task<Results<Ok, BadRequest>> (
                    BookingDto bookingDto,
                    IBookingRepository repo,
                    CancellationToken ct
                ) =>
                {
                    // Here you would call a method in your repository to add the booking to the database
                    // For example: await repo.AddBookingAsync(bookingDto, ct);
                    return TypedResults.Ok();
                }
            )
            .WithSummary("Create a new booking")
            .WithDescription(
                "Creates a new booking with the provided booking data"
            );
        return app;
    }
}
