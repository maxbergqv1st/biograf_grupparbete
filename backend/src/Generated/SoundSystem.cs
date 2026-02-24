using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("sound_system")]
public partial class SoundSystem
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("system_name")]
    [StringLength(50)]
    public string SystemName { get; set; }

    [Required]
    [Column("description", TypeName = "text")]
    public string Description { get; set; }

    [InverseProperty("SoundSystemNavigation")]
    public virtual ICollection<Hall> Halls { get; set; } = new List<Hall>();
}
