// Here you need to crete your endpoints. So, basically here you are working managing your request data and passing it to the repository,
// getting the response and send it back to the frontend. Also, we connect swagger here

using WebApp.Seats;

namespace WebApp;

public static class SeatsEndpoints
{
  public static IEndpointRouteBuilder MapSeatsEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/v2/seats").WithTags("Seats").RequireCors("V2");


    group.MapGet("/hall/{hallId:int}", async (int hallId, ISeatsRepository repo, CancellationToken ct) =>
    {
      var configs = await repo.GetHallRowConfigsAsync(hallId, ct);
      return Results.Ok(configs);
    });

    group.MapGet("/screening/{screeningId:int}", async (int screeningId, ISeatsRepository repo, CancellationToken ct) =>
    {
      var statuses = await repo.GetSeatStatusesAsync(screeningId, ct);
      return Results.Ok(statuses);
    });

    return app;
  }
}
