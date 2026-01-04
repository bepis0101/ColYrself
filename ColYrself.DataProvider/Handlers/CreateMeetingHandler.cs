using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Database;
using ColYrself.DataProvider.Models.Views;
using ColYrself.DataProvider.Services;
using MediatR;

namespace ColYrself.DataProvider.Handlers
{
    public class CreateMeetingParameters : IRequest<CreateMeetingResult>
    {
        public MeetingDetails Details { get; set; }
        public Guid UserId { get; set; }
    }
    public class CreateMeetingResult
    {
        public Guid Id { get; set; }
    }
    public class CreateMeetingHandler : IRequestHandler<CreateMeetingParameters, CreateMeetingResult>
    {
        private readonly ApplicationDbContext _context;
        public CreateMeetingHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CreateMeetingResult> Handle(CreateMeetingParameters meeting, CancellationToken token)
        {
            var user = UserService.GetUser(_context, meeting.UserId);
            if (user == null)
            {
                return new CreateMeetingResult() { Id = Guid.Empty };
            }
            var date = DateOnly.FromDateTime(DateTime.Parse(meeting.Details.Date));
            var users = _context.Users
                .Where(x => meeting.Details.Invited
                    .Select(m => Guid.Parse(m))
                    .Contains(x.Id)
                );
            var id = Guid.NewGuid();
            var dbMeeting = new Meeting()
            {
                Id = id,
                Name = meeting.Details.Name,
                Date = date,
                Time = TimeOnly.Parse(meeting.Details.Time),
                IsPrivate = meeting.Details.IsPrivate,
                OrganizerId = user.Id,
                InvitedUsers = users.ToList(),
                Organizer = user
            };
            await _context.AddAsync(dbMeeting, token);
            await _context.SaveChangesAsync(token);
            return new CreateMeetingResult() { Id = id };
        }
    }
}
