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
            var findUser = await _context.Users.FirstOrDefaultAsync(u => u.email == model.Email);
            if (findUser != null) return RegistartionStatus.UserFound;
            if (model.RepeatPassword != model.Password) return RegistartionStatus.PasswordsDontMatch;

            var user = new User()
            {
                email = model.Email,
                username = model.Username
            };
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            user = await _context.Users.FirstOrDefaultAsync(u => u.email == model.Email);
            var password = new Password()
            {
                user_id = user.id,
                password = PasswordService.HashPassword(model.Password)
            };

            await _context.Passwords.AddAsync(password);
            await _context.SaveChangesAsync();
            return RegistartionStatus.Success;
        }
    }
}
