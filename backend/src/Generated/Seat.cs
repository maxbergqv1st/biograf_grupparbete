using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("seat")]
[Index("Type", Name = "type")]
[Index("HallId", "RowName", "NumberInRow", Name = "unique_seat_id", IsUnique = true)]
public partial class Seat
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("hall_id")]
    public int? HallId { get; set; }

    [Required]
    [Column("row_name")]
    [StringLength(10)]
    public string RowName { get; set; }

    [Column("number_in_row")]
    public int NumberInRow { get; set; }

    [Column("type")]
    public int Type { get; set; }

    [InverseProperty("Seat")]
    public virtual ICollection<BookingSeat> BookingSeats { get; set; } = new List<BookingSeat>();

    [ForeignKey("HallId, RowName")]
    [InverseProperty("Seats")]
    public virtual HallRowConfig HallRowConfig { get; set; }

    [InverseProperty("Seat")]
    public virtual ICollection<SeatGhost> SeatGhosts { get; set; } = new List<SeatGhost>();

    [ForeignKey("Type")]
    [InverseProperty("Seats")]
    public virtual SeatType TypeNavigation { get; set; }
}
