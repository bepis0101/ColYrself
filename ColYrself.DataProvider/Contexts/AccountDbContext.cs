using ColYrself.DataProvider.Models.Database;
using Microsoft.EntityFrameworkCore;

namespace ColYrself.DataProvider.Contexts
{
    public class AccountDbContext : DbContext
    {

        public DbSet<User> Users { get; set; }
        public DbSet<Password> Passwords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Password>().ToTable("passwords");
            base.OnModelCreating(modelBuilder);
        }

        public AccountDbContext(DbContextOptions<AccountDbContext> options)
        : base(options)
        {
        }

    }
}
