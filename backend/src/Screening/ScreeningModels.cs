// This file is for describing the models for you data
namespace WebApp.Screenings;


public record ScreeningDto(
    int Id,
    int MovieId,
    int HallId,
    string HallName,
    DateOnly ScreeningDate,
    TimeOnly ScreeningTime
);


public record CreateScreeningDto(
    int MovieId,
    int HallId,
    DateOnly ScreeningDate,
    TimeOnly ScreeningTime
);
