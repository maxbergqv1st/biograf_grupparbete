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
/*
public record BookingDto(
    int Id,
    string Email,
    int ScreeningId,
    string ScreeningDate,
    decimal TotalPrice,
    string Status,
    string Reference,
    int UserId
);
*/


public record CreateScreeningDto(
    int MovieId,
    int HallId,
    DateOnly ScreeningDate,
    TimeOnly ScreeningTime
);
