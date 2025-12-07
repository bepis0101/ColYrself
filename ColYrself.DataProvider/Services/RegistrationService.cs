using ColYrself.DataProvider.Contexts;
using Microsoft.EntityFrameworkCore;
using ColYrself.DataProvider.Models.Database;
using ColYrself.DataProvider.Models.Views;

namespace ColYrself.DataProvider.Services
{
    public enum RegistartionStatus
    {
        UserFound,
        PasswordsDontMatch,
        Success
    }
    public class RegistrationService
    {
        private readonly ApplicationDbContext _context;
        public RegistrationService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<RegistartionStatus> AuthorizeRegistration(SignUpDetails model)
        {
            var findUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);
            if (findUser != null) return RegistartionStatus.UserFound;
            if (model.RepeatPassword != model.Password) return RegistartionStatus.PasswordsDontMatch;
            var user_id = Guid.NewGuid();
            var user = new User()
            {
                Id = user_id,
                Email = model.Email,
                Username = model.Username
            };
            await _context.Users.AddAsync(user);
            var password = new Password()
            {
                UserId = user_id,
                PasswordHash = PasswordService.HashPassword(model.Password)
            };

            await _context.Passwords.AddAsync(password);
            await _context.SaveChangesAsync();
            return RegistartionStatus.Success;
        }
    }
}
