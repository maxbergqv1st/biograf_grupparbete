using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("screening")]
[Index("HallId", Name = "hall_id")]
[Index("MovieId", Name = "movie_id")]
public partial class Screening
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("movie_id")]
    public int MovieId { get; set; }

    [Column("hall_id")]
    public int HallId { get; set; }

    [Column("start_time", TypeName = "datetime")]
    public DateTime StartTime { get; set; }

    [Column("end_time", TypeName = "datetime")]
    public DateTime EndTime { get; set; }

    [Column("base_price")]
    [Precision(10, 2)]
    public decimal? BasePrice { get; set; }

    [InverseProperty("Screening")]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    [ForeignKey("HallId")]
    [InverseProperty("Screenings")]
    public virtual Hall Hall { get; set; }

    [ForeignKey("MovieId")]
    [InverseProperty("Screenings")]
    public virtual Movie Movie { get; set; }

    [InverseProperty("Screening")]
    public virtual ICollection<SeatGhost> SeatGhosts { get; set; } = new List<SeatGhost>();
}
