using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("price_category_seat")]
public partial class PriceCategorySeat
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("category", TypeName = "enum('Adult','Child','Senior','Student','Handicap')")]
    public string Category { get; set; }

    [Column("discount_modifier")]
    [Precision(5, 2)]
    public decimal? DiscountModifier { get; set; }

    [InverseProperty("PriceCategorySeat")]
    public virtual ICollection<BookingSeat> BookingSeats { get; set; } = new List<BookingSeat>();
}
