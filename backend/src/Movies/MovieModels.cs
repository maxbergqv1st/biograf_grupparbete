// This file is for describing the models for you data
namespace WebApp.Movies;

public record LanguageDto(int Id, string Name, string Code);

public record ActorDto(
    int Id,
    string Name,
    string? ImageUrl,
    int? CastOrder
    );

public record MovieSummaryDto(
    int Id,
    string Title,
    string Tagline,
    string AgeRating,
    string? PosterUrl,
    string? TrailerUrl,
    LanguageDto Language,
    List<string> Genres
);

public record MovieDto(
    int Id,
    string Title,
    string? OriginalTitle,
    string Tagline,
    string Description,
    int Duration,
    string AgeRating,
    string Director,
    DateOnly ReleaseDate,
    string? PosterUrl,
    string? TrailerUrl,
    LanguageDto Language,
    List<string> Genres,
    List<ActorDto> Actors
);

public record MovieQuery(string? Search, string? Genre, string? AgeRating, DateOnly? ScreeningDate);
