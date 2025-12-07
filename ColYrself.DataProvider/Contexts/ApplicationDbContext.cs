using ColYrself.DataProvider.Models.Database;
using Microsoft.EntityFrameworkCore;

namespace ColYrself.DataProvider.Contexts
{
    public class ApplicationDbContext : DbContext
    {

        public DbSet<User> Users { get; set; }
        public DbSet<Password> Passwords { get; set; }
        public DbSet<Meeting> Meetings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .ToTable("users")
                .HasMany(x => x.Passwords)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId);

            modelBuilder.Entity<Password>()
                .ToTable("passwords");

            modelBuilder.Entity<Meeting>(entity =>
            {
                entity.ToTable("meetings");
                
                entity.HasOne(m => m.Organizer)
                  .WithMany(u => u.OrganizedMeetings)
                  .HasForeignKey(m => m.OrganizerId)
                  .OnDelete(DeleteBehavior.Restrict);

                entity
                    .HasMany(m => m.InvitedUsers)
                    .WithMany(m => m.InvitedMeetings)
                    .UsingEntity<Dictionary<string, object>>(
                        "meeting_invitations",
                        j => j.HasOne<User>().WithMany().HasForeignKey("UserId"),
                        j => j.HasOne<Meeting>().WithMany().HasForeignKey("MeetingId")
                    );
            });

            base.OnModelCreating(modelBuilder);
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }

    }
}
