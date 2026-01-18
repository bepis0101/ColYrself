using ColYrself.DataProvider.Contexts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ColYrself.DataProvider.Handlers
{
    public class IsUserAllowedParameters : IRequest<IsUserAllowedResult>
    {
        public string UserId { get; set; }
        public string MeetingId { get; set; }
    }
    public class IsUserAllowedResult
    {
        public bool IsUserAllowed { get; set; }
    }
    public class IsUserAllowedHandler : IRequestHandler<IsUserAllowedParameters, IsUserAllowedResult>
    {
        private readonly ApplicationDbContext _context;
        public IsUserAllowedHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IsUserAllowedResult> Handle(IsUserAllowedParameters parameters, CancellationToken token)
        {
            var id = Guid.Parse(parameters.UserId);
            var meetingId = Guid.Parse(parameters.MeetingId);
            var meeting = await _context.Meetings.Include(x => x.InvitedUsers).FirstOrDefaultAsync(x => x.Id == meetingId, token);
            if (meeting == null) return new IsUserAllowedResult() { IsUserAllowed = false };
            if (meeting.IsPrivate == false || meeting.OrganizerId == id || meeting.InvitedUsers.Any(x => x.Id == id))
            {
                return new IsUserAllowedResult() { IsUserAllowed = true };
            }
            return new IsUserAllowedResult() { IsUserAllowed = false };
        }
    }
}
