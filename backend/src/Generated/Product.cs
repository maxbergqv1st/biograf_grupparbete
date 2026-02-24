using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("products")]
public partial class Product
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("name")]
    [StringLength(255)]
    public string Name { get; set; }

    [Required]
    [Column("description", TypeName = "text")]
    public string Description { get; set; }

    [Required]
    [Column("quantity")]
    [StringLength(50)]
    public string Quantity { get; set; }

    [Column("price$")]
    [Precision(10, 2)]
    public decimal Price { get; set; }

    [Required]
    [Column("slug")]
    [StringLength(255)]
    public string Slug { get; set; }

    [Required]
    [Column("categories", TypeName = "json")]
    public string Categories { get; set; }
}
