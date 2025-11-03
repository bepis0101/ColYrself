using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Database;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ColYrself.DataProvider.Services
{
    public static class UserService
    {
        public static User? GetUser(HttpContext httpContext, AccountDbContext userContext)
        {
            var idValue = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(idValue == null)
            {
                return null;
            }
            
            var id = Guid.Parse(idValue);
            
            if (id == Guid.Empty)
            {
                return null;
            }

            var user = userContext.Users.FirstOrDefault(x => x.id == id);
            return user;
        }
    }
}
