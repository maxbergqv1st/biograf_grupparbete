using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[PrimaryKey("BookingId", "SeatId")]
[Table("booking_seat")]
[Index("PriceCategorySeatId", Name = "price_category_seat_id")]
[Index("SeatId", Name = "seat_id")]
public partial class BookingSeat
{
    [Key]
    [Column("booking_id")]
    public int BookingId { get; set; }

    [Key]
    [Column("seat_id")]
    public int SeatId { get; set; }

    [Column("price_category_seat_id")]
    public int PriceCategorySeatId { get; set; }

    [Column("final_price")]
    [Precision(10, 2)]
    public decimal FinalPrice { get; set; }

    [ForeignKey("BookingId")]
    [InverseProperty("BookingSeats")]
    public virtual Booking Booking { get; set; }

    [ForeignKey("PriceCategorySeatId")]
    [InverseProperty("BookingSeats")]
    public virtual PriceCategorySeat PriceCategorySeat { get; set; }

    [ForeignKey("SeatId")]
    [InverseProperty("BookingSeats")]
    public virtual Seat Seat { get; set; }
}
