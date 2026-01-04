using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ColYrself.DataProvider.Handlers
{
    public class GetMeetingParameters : IRequest<GetMeetingResult>
    {
        public Guid UserId { get; set; }
        public string MeetingId { get; set; }
    }

    public class GetMeetingResult 
    {
        public MeetingDto? Meeting { get; set; }
    }
    public class GetMeetingHandler : IRequestHandler<GetMeetingParameters, GetMeetingResult>
    {
        private readonly ApplicationDbContext _context;
        public GetMeetingHandler(ApplicationDbContext context) 
        {
            _context = context; 
        }
        public async Task<GetMeetingResult> Handle(GetMeetingParameters parameters, CancellationToken token)
        {
            var meetingId = Guid.Parse(parameters.MeetingId);
            if (meetingId == Guid.Empty)
            {
                return new GetMeetingResult() { };
            }
            var meeting = await _context.Meetings
                .Include(x => x.InvitedUsers)
                .FirstOrDefaultAsync(x => x.Id == meetingId && 
                                          x.OrganizerId == parameters.UserId, token);
            if(meeting == null)
            {
                return new GetMeetingResult() { };
            }
            var meetingDto = new MeetingDto()
            {
                Id = meetingId,
                Date = meeting.Date,
                Time = meeting.Time,
                OrganizerId = parameters.UserId,
                InvitedUsers = meeting.InvitedUsers
                    .Select(x =>
                        new UserDto()
                        {
                            Id = x.Id.ToString(),
                            Email = x.Email,
                            Username = x.Username
                        })
                    .ToList(),
                IsPrivate = meeting.IsPrivate,
                Name = meeting.Name
            };
            return new GetMeetingResult() { Meeting = meetingDto };
        }
    }
}
