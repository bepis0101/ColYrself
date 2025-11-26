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

        public async Task<UserLoginResponse> TryLogin(LoginDetails model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.username == model.Username);
            if (user == null)
            {
                return new UserLoginResponse()
                {
                    ErrorMessage = "Incorrect password or user doesn't exist",
                };
            }
            var password = await _context.Passwords.FirstOrDefaultAsync(p => p.user_id == user.id);
            if(password == null)
            {
                return new UserLoginResponse()
                {
                    ErrorMessage = "Incorrect password or user doesn't exist",
                };
            }
            var verification = PasswordService.VerifyPassword(model.Password, password.password);
            if(!verification)
            {
                return new UserLoginResponse()
                {
                    ErrorMessage = "Incorrect password or user doesn't exist",
                };
            }
            return new UserLoginResponse()
            {
                UserObj = user
            };
        }
    }
    public class UserLoginResponse
    {
        public User? UserObj { get; set; } = null;
        public string? ErrorMessage { get; set; }
    }
}
