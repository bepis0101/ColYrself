using ColYrself.DataProvider.Contexts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ColYrself.DataProvider.Handlers
{
    public class DeleteUserFromRoomParameters : IRequest<DeleteUserFromRoomResult>
    {
        public string UserId { get; set; }
        public string MeetingId { get; set; }
        public string ConnectionId { get; set; }
    }
    public class DeleteUserFromRoomResult { }
    public class DeleteUserFromRoomHandler : IRequestHandler<DeleteUserFromRoomParameters, DeleteUserFromRoomResult>
    {
        private readonly ApplicationDbContext _context;
        public DeleteUserFromRoomHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<DeleteUserFromRoomResult> Handle(DeleteUserFromRoomParameters parameters, CancellationToken token)
        {
            var userId = Guid.Parse(parameters.UserId);
            var meetingId = Guid.Parse(parameters.MeetingId);
            if (meetingId == Guid.Empty)
            {
                var user = await _context.RoomUsers
                    .FirstOrDefaultAsync(x => x.ConnectionId == parameters.ConnectionId && x.UserId == userId, token);
                if (user == null)
                {
                    return new DeleteUserFromRoomResult();
                }
                _context.RoomUsers.Remove(user);
                await _context.SaveChangesAsync(token);
                return new DeleteUserFromRoomResult();
            }
            else
            {
                var user = await _context.RoomUsers.FirstOrDefaultAsync(x => x.UserId == userId && x.Room.MeetingId == meetingId, token);
                if (user == null)
                {
                    return new DeleteUserFromRoomResult();
                }
                _context.RoomUsers.Remove(user);
                await _context.SaveChangesAsync(token);
                return new DeleteUserFromRoomResult();
            }
        }
    }
}
