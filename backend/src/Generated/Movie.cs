using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("movie")]
[Index("Language", Name = "language")]
public partial class Movie
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("title")]
    [StringLength(255)]
    public string Title { get; set; }

    [Required]
    [Column("description_short")]
    [StringLength(255)]
    public string DescriptionShort { get; set; }

    [Required]
    [Column("description", TypeName = "text")]
    public string Description { get; set; }

    [Column("duration_minutes")]
    public int DurationMinutes { get; set; }

    [Required]
    [Column("age_rating", TypeName = "enum('B','7','11','15')")]
    public string AgeRating { get; set; }

    [Required]
    [Column("director")]
    [StringLength(255)]
    public string Director { get; set; }

    [Column("release_date")]
    public DateOnly ReleaseDate { get; set; }

    [Column("language")]
    public int Language { get; set; }

    [Column("poster")]
    [StringLength(100)]
    public string Poster { get; set; }

    [ForeignKey("Language")]
    [InverseProperty("Movies")]
    public virtual MovieLanguage LanguageNavigation { get; set; }

    [InverseProperty("Movie")]
    public virtual ICollection<Screening> Screenings { get; set; } = new List<Screening>();
}
