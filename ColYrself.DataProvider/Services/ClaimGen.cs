using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using ColYrself.DataProvider.Models.Database;

namespace ColYrself.DataProvider.Services
{
    public class ClaimGen
    {
        public static ClaimsPrincipal GeneratePrincipal(UserLoginResponse user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            return principal;
        }
    }
}
