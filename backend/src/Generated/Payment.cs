using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("payment")]
[Index("BookingId", Name = "booking_id")]
public partial class Payment
{
    [Key]
    [Column("payment_id")]
    public int PaymentId { get; set; }

    [Column("booking_id")]
    public int BookingId { get; set; }

    [Required]
    [Column("payment_method")]
    [StringLength(50)]
    public string PaymentMethod { get; set; }

    [Column("amount")]
    [Precision(10, 2)]
    public decimal Amount { get; set; }

    [Column("status", TypeName = "enum('pending','accepted','declined')")]
    public string Status { get; set; }

    [Column("created", TypeName = "datetime")]
    public DateTime? Created { get; set; }

    [ForeignKey("BookingId")]
    [InverseProperty("Payments")]
    public virtual Booking Booking { get; set; }
}
