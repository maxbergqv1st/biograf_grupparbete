using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("movie_language")]
public partial class MovieLanguage
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("movie_lang_enum", TypeName = "enum('Svenska','Engelska')")]
    public string MovieLangEnum { get; set; }

    [Required]
    [Column("movie_lang_short_enum", TypeName = "enum('Sv','En')")]
    public string MovieLangShortEnum { get; set; }

    [InverseProperty("LanguageNavigation")]
    public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
