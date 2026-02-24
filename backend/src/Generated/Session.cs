using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Generated;

[Table("sessions")]
public partial class Session
{
    [Key]
    [Column("id")]
    public string Id { get; set; }

    [Column("created", TypeName = "datetime")]
    public DateTime Created { get; set; }

    [Column("modified", TypeName = "datetime")]
    public DateTime Modified { get; set; }

    [Column("data", TypeName = "json")]
    public string Data { get; set; }
}
