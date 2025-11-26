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
        private readonly AccountDbContext _context;
        public RegistrationService(AccountDbContext context)
        {
            _context = context;
        }
        public async Task<RegistartionStatus> AuthorizeRegistration(SignUpDetails model)
        {
            var findUser = await _context.Users.FirstOrDefaultAsync(u => u.username == model.Username);
            if (findUser != null) return RegistartionStatus.UserFound;
            if (model.RepeatPassword != model.Password) return RegistartionStatus.PasswordsDontMatch;
            var user_id = Guid.NewGuid();
            var user = new User()
            {
                id = user_id,
                email = model.Email,
                username = model.Username
            };
            await _context.Users.AddAsync(user);
            var password = new Password()
            {
                user_id = user_id,
                password = PasswordService.HashPassword(model.Password)
            };

            await _context.Passwords.AddAsync(password);
            await _context.SaveChangesAsync();
            return RegistartionStatus.Success;
        }
    }
}
