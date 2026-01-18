using ColYrself.DataProvider.Contexts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ColYrself.DataProvider.Handlers
{
    public class GetRoomUserParameters : IRequest<GetRoomUserResult>
    {
        public string UserId { get; set; }
    }
    public class GetRoomUserResult
    {
        public List<string> MeetingIds { get; set; } = [];
    }
    public class GetRoomUserHandler : IRequestHandler<GetRoomUserParameters, GetRoomUserResult>
    {
        private readonly ApplicationDbContext _context;
        public GetRoomUserHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<GetRoomUserResult> Handle(GetRoomUserParameters parameters, CancellationToken token)
        {
            var userId = Guid.Parse(parameters.UserId);
            var meetings = await _context.RoomUsers
                .Include(x => x.Room)
                .Where(x => x.UserId == userId)
                .Select(x => x.Room.MeetingId.ToString().ToLower())
                .ToListAsync(token);
            return new GetRoomUserResult() { MeetingIds = meetings };
        }
    }
}
