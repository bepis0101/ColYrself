using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Database;
using ColYrself.DataProvider.Models.Views;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace ColYrself.Handlers
{
    public class UpdateMeetingParameters : IRequest<UpdateMeetingResult>
    {
        public Guid UserId { get; set; }
        public Guid MeetingId { get; set; }
        public MeetingDetails Details { get; set; }
    }
    public class UpdateMeetingResult 
    {
        public Guid MeetingId { get; set; }
    }

    public class UpdateMeetingHandler : IRequestHandler<UpdateMeetingParameters, UpdateMeetingResult>
    {
        private readonly ApplicationDbContext _context;
        public UpdateMeetingHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<UpdateMeetingResult> Handle(UpdateMeetingParameters parameters, CancellationToken token)
        {
            var meeting = await _context.Meetings
                .Include(x => x.InvitedUsers)
                .FirstOrDefaultAsync(x => x.Id == parameters.MeetingId, cancellationToken: token);            
            if(meeting == null)
            {
                return new UpdateMeetingResult { MeetingId = Guid.Empty };
            }
            if (DateOnly.TryParse(parameters.Details.Date, out var date)) meeting.Date = date;
            if (TimeOnly.TryParse(parameters.Details.Time, out var time)) meeting.Time = time;
            meeting.IsPrivate = parameters.Details.IsPrivate;
            meeting.Name = parameters.Details.Name;
            meeting.InvitedUsers.Clear();

            var newUserIds = parameters.Details.Invited
                .Select(Guid.Parse)
                .Distinct()
                .ToList();

            foreach (var userId in newUserIds)
            {
                var localEntry = _context.Users.Local.FirstOrDefault(u => u.Id == userId);

                if (localEntry != null)
                {
                    meeting.InvitedUsers.Add(localEntry);
                }
                else
                {
                    var userStub = new User { Id = userId };
                    _context.Attach(userStub);
                    meeting.InvitedUsers.Add(userStub);
                }
            }

            await _context.SaveChangesAsync();
            return new UpdateMeetingResult() { MeetingId = parameters.MeetingId };
        }
    }
}
