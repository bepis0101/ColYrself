using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Views;
using ColYrself.DataProvider.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDetails user)
        {
            var service = new LoginService(_context);
            var response = await service.TryLogin(user);
            if (response == null) return Unauthorized();
            await HttpContext.SignInAsync(ClaimGen.GeneratePrincipal(response));
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
                    return BadRequest("Passwords don't match");
                case RegistartionStatus.UserFound:
                    return BadRequest("Account already exists");
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
    }
}
