using ColYrself.DataProvider.Models.Views;
using ColYrself.DataProvider.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using MediatR;
using ColYrself.Handlers;
using System.Threading.Tasks;

namespace ColYrself.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IMediator _mediator;
        public AccountController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [Authorize]
        [HttpGet("Users")]
        public async Task<IActionResult> GetUsers()
        {
            var userId = UserService.GetUserId(HttpContext);
            var result = await _mediator.Send(new GetUsersParameters() { UserId = userId });
            return Ok(result.Users);
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDetails user)
        {
            var result = await _mediator.Send(new LoginParameters() { Details = user });
            if (result == null) return BadRequest();
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme, 
                result.ClaimsPrincipal,
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(7),
                }
            );
            return Ok(result.UserLoginResponse);
        }
        [HttpPost("SignUp")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDetails user)
        {
            var result = await _mediator.Send(new SignupParameters() { SignUpDetails = user });
            switch (result.Status)
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
        public async Task<IActionResult> GetCurrent()
        {        
            var userId = UserService.GetUserId(HttpContext);
            var result = await _mediator.Send(new GetUserParameters() { UserId = userId });
            if(result.User == null)
            {
                return NotFound();
            }
            return Ok(result.User);
        }
    }
}
