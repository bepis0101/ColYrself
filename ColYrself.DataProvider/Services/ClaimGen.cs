using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using ColYrself.DataProvider.Models.Database;

namespace ColYrself.DataProvider.Services
{
    public class ClaimGen
    {
        public static ClaimsPrincipal GeneratePrincipal(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.username),
                new Claim(ClaimTypes.Email, user.email),
                new Claim(ClaimTypes.NameIdentifier, user.id.ToString())
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            return principal;
        }
    }
}
