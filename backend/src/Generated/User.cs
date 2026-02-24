using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("users")]
[Index("Email", Name = "email", IsUnique = true)]
public partial class User
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("created")]
    public DateOnly Created { get; set; }

    [Required]
    [Column("email")]
    public string Email { get; set; }

    [Required]
    [Column("firstName")]
    [StringLength(255)]
    public string FirstName { get; set; }

    [Required]
    [Column("lastName")]
    [StringLength(255)]
    public string LastName { get; set; }

    [Required]
    [Column("role")]
    [StringLength(50)]
    public string Role { get; set; }

    [Required]
    [Column("password")]
    [StringLength(255)]
    public string Password { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
