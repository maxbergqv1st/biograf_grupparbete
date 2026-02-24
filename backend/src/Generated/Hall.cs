using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("hall")]
[Index("SoundSystem", Name = "sound_system")]
[Index("Type", Name = "type")]
public partial class Hall
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("name")]
    [StringLength(100)]
    public string Name { get; set; }

    [Column("type")]
    public int Type { get; set; }

    [Column("row_count")]
    public int RowCount { get; set; }

    [Column("sound_system")]
    public int SoundSystem { get; set; }

    [Column("screen_size")]
    public short ScreenSize { get; set; }

    [InverseProperty("Hall")]
    public virtual ICollection<HallRowConfig> HallRowConfigs { get; set; } = new List<HallRowConfig>();

    [InverseProperty("Hall")]
    public virtual ICollection<Screening> Screenings { get; set; } = new List<Screening>();

    [ForeignKey("SoundSystem")]
    [InverseProperty("Halls")]
    public virtual SoundSystem SoundSystemNavigation { get; set; }

    [ForeignKey("Type")]
    [InverseProperty("Halls")]
    public virtual HallType TypeNavigation { get; set; }
}
