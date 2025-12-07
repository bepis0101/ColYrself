using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Database;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ColYrself.DataProvider.Services
{
    public static class UserService
    {
        public static User? GetUser(HttpContext httpContext, ApplicationDbContext userContext)
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

            var user = userContext.Users.FirstOrDefault(x => x.Id == id);
            return user;
        }
        public static User? GetUserWithMeetings(HttpContext httpContext, ApplicationDbContext userContext)
        {
            var idValue = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (idValue == null)
            {
                return null;
            }
            var id = Guid.Parse(idValue);
            if (id == Guid.Empty)
            {
                return null;
            }
            var user = userContext.Users
                .Where(x => x.Id == id)
                .Include(x => x.InvitedMeetings)
                .Include(x => x.OrganizedMeetings)
                .FirstOrDefault();
            return user;
        }
    }
}
