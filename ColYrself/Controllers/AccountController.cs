using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Views;
using ColYrself.DataProvider.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ColYrself.DataProvider.Models.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace ColYrself.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AccountDbContext _context;
        public AccountController(AccountDbContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet("Users")]
        public async Task<IActionResult> GetUsers()
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(String.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            var users = await _context.Users.Where(x => x.id != Guid.Parse(userId)).ToListAsync();
            return Ok(users);
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDetails user)
        {
            var service = new LoginService(_context);
            var response = await service.TryLogin(user);
            if (response == null || response.UserObj == null) return Unauthorized(response?.ErrorMessage);
            var claims = ClaimGen.GeneratePrincipal(response.UserObj);
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme, 
                claims,
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(7),
                }
            );
            return Ok(response);
        }
        [HttpPost("SignUp")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDetails user)
        {
            var registration = new RegistrationService(_context);
            var response = await registration.AuthorizeRegistration(user);
            switch (response)
            {
                case RegistartionStatus.Success:
                    return Ok();
                case RegistartionStatus.PasswordsDontMatch:
                    return Unauthorized("Passwords don't match");
                case RegistartionStatus.UserFound:
                    return Unauthorized("Account already exists");
                default:
                    return NotFound();
            }
        }
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return Ok();
        }
        [Authorize]
        [HttpGet("Me")]
        public IActionResult GetCurrent()
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var username = HttpContext.User.Identity?.Name;
            var email = HttpContext.User.FindFirstValue(ClaimTypes.Email);
            if(userId == null || username == null || email == null)
            {
                return Unauthorized();
            }
            if(Guid.Parse(userId) == Guid.Empty)
            {
                return NotFound();
            }
            var user = new UserLoginResponse()
            {
                ErrorMessage = "",
                UserObj = new User()
                {
                    email = email,
                    id = Guid.Parse(userId),
                    username = username
                }
            };
            return Ok(user);
        }
    }
}
