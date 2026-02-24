using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("seat_ghost")]
[Index("ScreeningId", Name = "screening_id")]
[Index("SeatId", Name = "seat_id")]
public partial class SeatGhost
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("screening_id")]
    public int ScreeningId { get; set; }

    [Column("seat_id")]
    public int SeatId { get; set; }

    [Required]
    [Column("session_id")]
    [StringLength(255)]
    public string SessionId { get; set; }

    [Column("reserved_at", TypeName = "datetime")]
    public DateTime? ReservedAt { get; set; }

    [Column("expires_at", TypeName = "datetime")]
    public DateTime ExpiresAt { get; set; }

    [ForeignKey("ScreeningId")]
    [InverseProperty("SeatGhosts")]
    public virtual Screening Screening { get; set; }

    [ForeignKey("SeatId")]
    [InverseProperty("SeatGhosts")]
    public virtual Seat Seat { get; set; }
}
