using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("acl")]
[Index("UserRoles", "Method", "Route", Name = "unique_acl", IsUnique = true)]
public partial class Acl
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("userRoles")]
    public string UserRoles { get; set; }

    [Required]
    [Column("method")]
    [StringLength(50)]
    public string Method { get; set; }

    [Required]
    [Column("allow", TypeName = "enum('allow','disallow')")]
    public string Allow { get; set; }

    [Required]
    [Column("route")]
    public string Route { get; set; }

    [Required]
    [Column("match", TypeName = "enum('true','false')")]
    public string Match { get; set; }

    [Required]
    [Column("comment")]
    [StringLength(500)]
    public string Comment { get; set; }
}
