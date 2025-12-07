using ColYrself.DataProvider.Contexts;
using Microsoft.EntityFrameworkCore;
using ColYrself.DataProvider.Models.Views;
using ColYrself.DataProvider.Models.Database;

namespace ColYrself.DataProvider.Services
{
    public class LoginService
    {
        private readonly ApplicationDbContext _context;
        public LoginService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserLoginResponse> TryLogin(LoginDetails model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);
            if (user == null)
            {
                return new UserLoginResponse()
                {
                    ErrorMessage = "Incorrect password or user doesn't exist",
                };
            }
            var password = await _context.Passwords.FirstOrDefaultAsync(p => p.UserId == user.Id);
            if(password == null)
            {
                return new UserLoginResponse()
                {
                    ErrorMessage = "Incorrect password or user doesn't exist",
                };
            }
            var verification = PasswordService.VerifyPassword(model.Password, password.PasswordHash);
            if(!verification)
            {
                return new UserLoginResponse()
                {
                    ErrorMessage = "Incorrect password or user doesn't exist",
                };
            }
            return new UserLoginResponse()
            {
                Id = user.Id.ToString(),
                Email = user.Email,
                Username = user.Username
            };
        }
    }
    public class UserLoginResponse
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
