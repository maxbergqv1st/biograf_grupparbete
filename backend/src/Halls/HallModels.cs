// This file is for describing the models for you data
namespace WebApp.Halls;

public record HallSummaryDto(
    int Id,
    string Name,
    int Type,
    int RowCount,
    int SoundSystem,
    short ScreenSize
);


public record HallDto(
    int Id,
    string Name,
    int Type,
    int RowCount,
    int SoundSystem,
    short ScreenSize
);
