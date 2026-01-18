using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ColYrself.DataProvider.Handlers
{
    public class GetRoomUsersParameters : IRequest<GetRoomUsersResult>
    {
        public string MeetingId { get; set; }
    }
    public class GetRoomUsersResult
    {
        public List<RoomUserDTO> ActiveUsers { get; set; } = [];
    }

    public class GetRoomUsersHandler : IRequestHandler<GetRoomUsersParameters, GetRoomUsersResult>
    {
        private readonly ApplicationDbContext _context;
        public GetRoomUsersHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<GetRoomUsersResult> Handle(GetRoomUsersParameters parameters, CancellationToken cancellationToken)
        {
            var meetingId = Guid.Parse(parameters.MeetingId);
            var users = await _context.RoomUsers
                .Where(x => x.Room.MeetingId == meetingId)
                .Include(x => x.User)
                .Select(x => new RoomUserDTO()
                { 
                    UserId = x.UserId.ToString(),
                    Username = x.User.Username,
                    ConnectionId = x.ConnectionId
                })
                .ToListAsync(cancellationToken);
            return new GetRoomUsersResult { ActiveUsers = users };
        }
    }
}
