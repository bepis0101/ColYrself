using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ColYrself.Handlers
{
    public class GetAllMeetingsParameters : IRequest<GetAllMeetingsResult>
    {
        public Guid UserId { get; set; }
    }
    public class GetAllMeetingsResult
    {
        public List<MeetingDto> Meetings { get; set; }
    }

    public class GetAllMeetingsHandler : IRequestHandler<GetAllMeetingsParameters, GetAllMeetingsResult>
    {
        private readonly ApplicationDbContext _context;
        public GetAllMeetingsHandler(ApplicationDbContext context) 
        {
            _context = context;
        }
        public async Task<GetAllMeetingsResult> Handle(GetAllMeetingsParameters parameters, CancellationToken token)
        {
            var meetings = await _context.Meetings
                .Include(x => x.InvitedUsers)
                .Include(x => x.Organizer)
                .Select(x => new MeetingDto()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Date = x.Date,
                    Time = x.Time,
                    Organizer = new UserDto()
                    {
                        Id = x.OrganizerId.ToString(),
                        Email = x.Organizer.Email,
                        Username = x.Organizer.Username
                    },
                    OrganizerId = x.OrganizerId,
                    IsPrivate = x.IsPrivate,
                    InvitedUsers = x.InvitedUsers
                        .Select(u => new UserDto()
                        {
                            Id = u.Id.ToString(),
                            Email = u.Email,
                            Username = u.Username,
                        })
                        .ToList()
                })
                .ToListAsync(token);
            return new GetAllMeetingsResult() { Meetings = meetings };
        }
    }
}
