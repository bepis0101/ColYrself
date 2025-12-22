using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Database;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ColYrself.DataProvider.Services
{
    public static class UserService
    {
        public static Guid GetUserId(HttpContext httpContext)
        {
            var idValue = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (idValue == null)
            {
                return Guid.Empty;
            }

            var id = Guid.Parse(idValue);
            return id;
        }
        public static bool IsAdmin(HttpContext httpContext)
        {
            return httpContext.User.IsInRole("Admin");
        }
        public static User? GetUser(ApplicationDbContext userContext, Guid userId)
        {
            var user = userContext.Users.FirstOrDefault(x => x.Id == userId);
            return user;
        }
        public static User? GetUserWithMeetings(ApplicationDbContext userContext, Guid userId)
        {
            var user = userContext.Users
                .Where(x => x.Id == userId)
                .Include(x => x.InvitedMeetings)
                .Include(x => x.OrganizedMeetings)
                .FirstOrDefault();
            return user;
        }
    }
}
