using ColYrself.DataProvider.Contexts;
using Microsoft.EntityFrameworkCore;
using ColYrself.DataProvider.Models.Views;
using ColYrself.DataProvider.Models.Database;

namespace ColYrself.DataProvider.Services
{
    public class LoginService
    {
        private readonly AccountDbContext _context;
        public LoginService(AccountDbContext context)
        {
            _context = context;
        }

        public async Task<User?> TryLogin(LoginDetails model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == model.Email);
            if (user == null) return null;
            var password = await _context.Passwords.FirstOrDefaultAsync(p => p.user_id == user.id);
            if(password == null) return null;
            var verification = PasswordService.VerifyPassword(model.Password, password.password);
            if(!verification) return null;
            return user;
        }
    }
}
