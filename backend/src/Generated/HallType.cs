using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("hall_type")]
public partial class HallType
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("type", TypeName = "enum('Standard','IMAX','4DX','Dolby Cinema','iSense','3D')")]
    public string Type { get; set; }

    [Required]
    [Column("description", TypeName = "text")]
    public string Description { get; set; }

    [InverseProperty("TypeNavigation")]
    public virtual ICollection<Hall> Halls { get; set; } = new List<Hall>();
}
