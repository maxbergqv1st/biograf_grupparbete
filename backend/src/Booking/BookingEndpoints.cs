// Här kopplas allt ihop med Swagger. Här görs endpoints. Ska kopplas med Orval. 

// Here you need to crete your endpoints. So, basically here you are working managing your request data and passing it to the repository,
// getting the response and send it back to the frontend. Also, we connect swagger here

using Microsoft.AspNetCore.Http.HttpResults;

namespace WebApp.Bookings;

public static class BookingEndpoints
{
    public static IEndpointRouteBuilder MapBookingEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v2/bookings").WithTags("Bookings").RequireCors("V2");

        group
            .MapGet(
                "/{id:int}",
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
                async Task<Results<Ok<BookingResult>, BadRequest>> (
                    CreateBookingDto dto,
                    IBookingRepository repo,
                    IEmailService emailService,
                    CancellationToken ct
                ) =>
                {
                    var result = await repo.AddBookingAsync(dto, ct);

                    try
                    {
                        await emailService.SendEmailAsync(
                            dto.Email,
                            "Booking Confirmation - Filmvisarna",
                            $"""
                            <h2>Booking Confirmed!</h2>
                            <p>Thank you for your booking at Filmvisarna.</p>
                            <p>Your booking reference: <strong>{result.BookingReference}</strong></p>
                            <p>Please save this reference for your records.</p>
                            """
                        );
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to send booking confirmation email: {ex.Message}");
                    }

                    return TypedResults.Ok(result);
                }
            )
            .WithSummary("Create a new booking")
            .WithDescription("Creates a new booking and sends a confirmation email");

        return app;
    }
}
