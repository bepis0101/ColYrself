using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.DTOs;
using ColYrself.DataProvider.Services;
using MediatR;

namespace ColYrself.Handlers
{
    public class GetMeetingsParameters : IRequest<GetMeetingsResult>
    {
        public Guid UserId { get; set; }
    }
    public class GetMeetingsResult
    {
        public ICollection<MeetingDto> Meetings { get; set; } = [];
    }
    public class GetMeetingsHandler : IRequestHandler<GetMeetingsParameters, GetMeetingsResult>
    {
        private readonly ApplicationDbContext _context;
        public GetMeetingsHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<GetMeetingsResult> Handle(GetMeetingsParameters parameters, CancellationToken token)
        {
            var user = UserService.GetUserWithMeetings(_context, parameters.UserId);
            if(user == null)
            {
                return new GetMeetingsResult() { Meetings = [] };
            }
            var invitedMeetings = user.InvitedMeetings.ToArray();
            var organizedMeetings = user.OrganizedMeetings.ToArray();
            var meetings = invitedMeetings
                .Concat(organizedMeetings)
                .Distinct()
                .Select(m => new MeetingDto()
                {
                    Date = m.Date,
                    Id = m.Id,
                    InvitedUsers = m.InvitedUsers
                        .Select(x => new UserDto() 
                        { 
                            Id = x.Id.ToString(), 
                            Email = x.Email, 
                            Username = x.Username
                        }
                    ).ToList(),
                    IsPrivate = m.IsPrivate,
                    Name = m.Name,
                    OrganizerId = m.OrganizerId,
                    Time = m.Time
                })
                .OrderByDescending(x => x.Date);
            return new GetMeetingsResult() { Meetings = meetings.ToList() };
        }
    }
}
