using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("booking")]
[Index("BookingReference", Name = "booking_reference", IsUnique = true)]
[Index("ScreeningId", Name = "screening_id")]
[Index("UserId", Name = "user_id")]
public partial class Booking
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int? UserId { get; set; }

    [Required]
    [Column("email")]
    [StringLength(254)]
    public string Email { get; set; }

    [Column("screening_id")]
    public int ScreeningId { get; set; }

    [Column("booking_date", TypeName = "datetime")]
    public DateTime? BookingDate { get; set; }

    [Column("total_price")]
    [Precision(10, 2)]
    public decimal? TotalPrice { get; set; }

    [Required]
    [Column("status", TypeName = "enum('pending','accepted','cancelled')")]
    public string Status { get; set; }

    [Required]
    [Column("booking_reference")]
    [StringLength(50)]
    public string BookingReference { get; set; }

    [InverseProperty("Booking")]
    public virtual ICollection<BookingSeat> BookingSeats { get; set; } = new List<BookingSeat>();

    [InverseProperty("Booking")]
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    [ForeignKey("ScreeningId")]
    [InverseProperty("Bookings")]
    public virtual Screening Screening { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("Bookings")]
    public virtual User User { get; set; }
}
