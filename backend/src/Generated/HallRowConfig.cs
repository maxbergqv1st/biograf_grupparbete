using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[PrimaryKey("HallId", "Name")]
[Table("hall_row_config")]
public partial class HallRowConfig
{
    [Key]
    [Column("hall_id")]
    public int HallId { get; set; }

    [Key]
    [Column("name")]
    [StringLength(10)]
    public string Name { get; set; }

    [Column("number_of_seats")]
    public int NumberOfSeats { get; set; }

    [ForeignKey("HallId")]
    [InverseProperty("HallRowConfigs")]
    public virtual Hall Hall { get; set; }

    [InverseProperty("HallRowConfig")]
    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
}
