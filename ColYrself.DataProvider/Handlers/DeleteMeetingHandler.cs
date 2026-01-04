using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ColYrself.DataProvider.Handlers
{
    public class DeleteMeetingParameters : IRequest<DeleteMeetingResult>
    {
        public Guid UserId { get; set; }
        public string MeetingId { get; set; }
    }
    public class DeleteMeetingResult 
    {
        public Guid MeetingId { get; set; }
    }
    public class DeleteMeetingHandler : IRequestHandler<DeleteMeetingParameters, DeleteMeetingResult>
    {
        private readonly ApplicationDbContext _context;
        public DeleteMeetingHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<DeleteMeetingResult> Handle(DeleteMeetingParameters parameters, CancellationToken token)
        {
            var user = UserService.GetUser(_context, parameters.UserId);
            if (user == null)
            {
                return new DeleteMeetingResult() { MeetingId = Guid.Empty };
            }
            var meetingGuid = Guid.Parse(parameters.MeetingId);
            if (meetingGuid == Guid.Empty)
            {
                return new DeleteMeetingResult() { MeetingId = Guid.Empty };
            }
            var meeting = await _context.Meetings.FirstOrDefaultAsync(x => x.Id == meetingGuid);
            if (meeting == null)
            {
                return new DeleteMeetingResult() { MeetingId = Guid.Empty };
            }
            if (meeting.OrganizerId != user.Id)
            {
                return new DeleteMeetingResult() { MeetingId = Guid.Empty };
            }
            _context.Remove(meeting);
            await _context.SaveChangesAsync();
            return new DeleteMeetingResult() { MeetingId = meetingGuid };
        }
    }
}
