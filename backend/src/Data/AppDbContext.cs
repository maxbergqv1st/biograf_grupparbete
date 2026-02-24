using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;
using WebApp.Generated;

namespace WebApp.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<BookingSeat> BookingSeats { get; set; }

    public virtual DbSet<Genre> Genres { get; set; }

    public virtual DbSet<Hall> Halls { get; set; }

    public virtual DbSet<HallRowConfig> HallRowConfigs { get; set; }

    public virtual DbSet<HallType> HallTypes { get; set; }

    public virtual DbSet<Movie> Movies { get; set; }

    public virtual DbSet<MovieLanguage> MovieLanguages { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<PriceCategorySeat> PriceCategorySeats { get; set; }

    public virtual DbSet<Screening> Screenings { get; set; }

    public virtual DbSet<Seat> Seats { get; set; }

    public virtual DbSet<SeatGhost> SeatGhosts { get; set; }

    public virtual DbSet<SeatType> SeatTypes { get; set; }

    public virtual DbSet<SoundSystem> SoundSystems { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=5.189.183.23;port=4567;user=h25halmstad-grupp4;password=ZHXXG73729;database=h25halmstad-grupp4", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.41-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.Property(e => e.BookingDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.Status).HasDefaultValueSql("'pending'");
            entity.Property(e => e.TotalPrice).HasDefaultValueSql("'0.00'");

            entity.HasOne(d => d.Screening).WithMany(p => p.Bookings)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("booking_ibfk_1");

            entity.HasOne(d => d.User).WithMany(p => p.Bookings)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("booking_ibfk_2");
        });

        modelBuilder.Entity<BookingSeat>(entity =>
        {
            entity.HasKey(e => new { e.BookingId, e.SeatId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.HasOne(d => d.Booking).WithMany(p => p.BookingSeats).HasConstraintName("booking_seat_ibfk_1");

            entity.HasOne(d => d.PriceCategorySeat).WithMany(p => p.BookingSeats).HasConstraintName("booking_seat_ibfk_3");

            entity.HasOne(d => d.Seat).WithMany(p => p.BookingSeats).HasConstraintName("booking_seat_ibfk_2");
        });

        modelBuilder.Entity<Genre>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
        });

        modelBuilder.Entity<Hall>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.HasOne(d => d.SoundSystemNavigation).WithMany(p => p.Halls).HasConstraintName("hall_ibfk_1");

            entity.HasOne(d => d.TypeNavigation).WithMany(p => p.Halls).HasConstraintName("hall_ibfk_2");
        });

        modelBuilder.Entity<HallRowConfig>(entity =>
        {
            entity.HasKey(e => new { e.HallId, e.Name })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.HasOne(d => d.Hall).WithMany(p => p.HallRowConfigs).HasConstraintName("hall_row_config_ibfk_1");
        });

        modelBuilder.Entity<HallType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.Property(e => e.Type).HasDefaultValueSql("'Standard'");
        });

        modelBuilder.Entity<Movie>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.HasOne(d => d.LanguageNavigation).WithMany(p => p.Movies).HasConstraintName("movie_ibfk_1");
        });

        modelBuilder.Entity<MovieLanguage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PRIMARY");

            entity.Property(e => e.Created).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.Booking).WithMany(p => p.Payments).HasConstraintName("payment_ibfk_1");
        });

        modelBuilder.Entity<PriceCategorySeat>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.Property(e => e.DiscountModifier).HasDefaultValueSql("'0.00'");
        });

        modelBuilder.Entity<Screening>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.Property(e => e.BasePrice).HasDefaultValueSql("'100.00'");

            entity.HasOne(d => d.Hall).WithMany(p => p.Screenings).HasConstraintName("screening_ibfk_2");

            entity.HasOne(d => d.Movie).WithMany(p => p.Screenings).HasConstraintName("screening_ibfk_1");
        });

        modelBuilder.Entity<Seat>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.HasOne(d => d.TypeNavigation).WithMany(p => p.Seats).HasConstraintName("seat_ibfk_2");

            entity.HasOne(d => d.HallRowConfig).WithMany(p => p.Seats)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("seat_ibfk_1");
        });

        modelBuilder.Entity<SeatGhost>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.Property(e => e.ReservedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.Screening).WithMany(p => p.SeatGhosts).HasConstraintName("seat_ghost_ibfk_1");

            entity.HasOne(d => d.Seat).WithMany(p => p.SeatGhosts).HasConstraintName("seat_ghost_ibfk_2");
        });

        modelBuilder.Entity<SeatType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.Property(e => e.Name).HasDefaultValueSql("'Standard'");
            entity.Property(e => e.Surcharge).HasDefaultValueSql("'0.00'");
        });

        modelBuilder.Entity<SoundSystem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.Property(e => e.Created).HasDefaultValueSql("curdate()");
            entity.Property(e => e.Role).HasDefaultValueSql("'user'");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
