// Here you need to crete your endpoints. So, basically here you are working managing your request data and passing it to the repository,
// getting the response and send it back to the frontend. Also, we connect swagger here

using Microsoft.AspNetCore.Http.HttpResults;
using WebApp.Seats;

namespace WebApp;

public static class SeatsEndpoints
{
  public static IEndpointRouteBuilder MapSeatsEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/v2/seats").WithTags("Seats").RequireCors("V2");

    group
        .MapGet(
            "/hall/{hallId:int}",
            async (
                int hallId,
                ISeatsRepository repo,
                CancellationToken ct
            ) =>
            {
              var configs = await repo.GetHallRowConfigsAsync(hallId, ct);
              return Results.Ok(configs);
            });

    group
        .MapGet(
            "/screening/{screeningId:int}",
             async (int screeningId,
             ISeatsRepository repo,
             CancellationToken ct
             ) =>
            {
              var statuses = await repo.GetSeatStatusesAsync(screeningId, ct);
              return Results.Ok(statuses);
            });

    group
        .MapPost(
            "/reserve",
             async Task<Results<Ok, Conflict<string>, BadRequest<string>>> (
            ReserveSeatsRequest request,
            ISeatsRepository repo,
            CancellationToken ct) =>
            {
              if (request.ScreeningId <= 0 || string.IsNullOrWhiteSpace(request.SessionId) || request.SeatIds.Count == 0)
              {
                return TypedResults.BadRequest("Invalid reservation request.");
              }

              var reserved = await repo.ReserveSeatsAsync(request, ct);
              return reserved
                ? TypedResults.Ok()
                : TypedResults.Conflict("One or more seats are no longer available.");
            });

    group
        .MapPost(
            "/release",
            async Task<Results<Ok, BadRequest<string>>> (
            ReleaseSeatsRequest request,
            ISeatsRepository repo,
            CancellationToken ct) =>
            {
              if (request.ScreeningId <= 0 || string.IsNullOrWhiteSpace(request.SessionId))
              {
                return TypedResults.BadRequest("Invalid release request.");
              }

              await repo.ReleaseSeatsAsync(request, ct);
              return TypedResults.Ok();
            });

    return app;
  }
}
