using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("seat_type")]
public partial class SeatType
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("name", TypeName = "enum('Standard','Premium','VIP','Handicap','Recliner')")]
    public string Name { get; set; }

    [Column("surcharge")]
    [Precision(10, 2)]
    public decimal? Surcharge { get; set; }

    [InverseProperty("TypeNavigation")]
    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
}
