using Microsoft.EntityFrameworkCore;
using ColYrself.DataProvider.Models.Database;
namespace ColYrself.DataProvider.Contexts
{
    public class MeetingContext : DbContext
    {
        public DbSet<Meeting> PlannedMeetings { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Meeting>()
                .ToTable("meetings"); 
            base.OnModelCreating(modelBuilder);
        }
        public MeetingContext(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

    }
}
