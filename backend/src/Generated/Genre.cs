using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("genre")]
public partial class Genre
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("name", TypeName = "enum('Action','Äventyr','Komedi','Drama','Skräck','Science Fiction','Thriller','Fantasy','Romantik','Western','Krig','Musikal','Dokumentär','Animerat')")]
    public string Name { get; set; }
}
