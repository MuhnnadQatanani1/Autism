using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Autsim.Models
{
    public class DataContext : IdentityDbContext<ApplicationUser>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<PecsCard> PecsCards { get; set; }
        public DbSet<PecsImage> PecsImages { get; set; } // Added DbSet for PecsImage

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Table configurations
            modelBuilder.Entity<ApplicationUser>().ToTable("Users");
            modelBuilder.Entity<PecsCard>().ToTable("PecsCards");
            modelBuilder.Entity<PecsImage>().ToTable("PecsImages");

            // Configure one-to-one relationship with cascade delete
            modelBuilder.Entity<PecsCard>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
            .ValueGeneratedOnAdd();
            entity.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(100);
            entity.Property(e => e.CreationTime)
            .HasDefaultValueSql("GETDATE()");
            entity.HasOne(pc => pc.Image)
                            .WithOne(pi => pi.PecsCard)
                            .HasForeignKey<PecsImage>(pi => pi.PecsCardID);
        });

        }

    }
}
