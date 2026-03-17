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
                "/api/v2/bookings/{id:int}",
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
            .WithSummary("Get booking by id")
            .WithDescription(
                "Returns booking by id"
            );

        group
            .MapPost(
                "/",
                async Task<Results<Ok<int>, BadRequest>> (
                    CreateBookingDto dto,
                    IBookingRepository repo,
                    CancellationToken ct
                ) =>
                {
                    var insertId = await repo.AddBookingAsync(dto, ct);
                    return TypedResults.Ok(insertId);
                }
            )
            .WithSummary("Create a new booking")
            .WithDescription("Creates a new booking");

        return app;
    }
}
