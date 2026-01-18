using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Database;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ColYrself.DataProvider.Handlers
{
    public class AddRoomUserParameters : IRequest<AddRoomUserResult>
    {
        public string MeetingId { get; set; }
        public string UserId { get; set; }
        public string ConnectionId { get; set; }

    }
    public class AddRoomUserResult {}
    public class AddRoomUserHandler : IRequestHandler<AddRoomUserParameters, AddRoomUserResult>
    {
        private readonly ApplicationDbContext _context;
        public AddRoomUserHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<AddRoomUserResult> Handle(AddRoomUserParameters parameters, CancellationToken token)
        {
            var meetingId = Guid.Parse(parameters.MeetingId);
            var userId = Guid.Parse(parameters.UserId);
            var room = await _context.Rooms.FirstOrDefaultAsync(x => x.MeetingId == meetingId, token);
            if (room != null)
            {
                var userInRoom = await _context.RoomUsers
                    .FirstOrDefaultAsync(x => x.RoomId == room.Id && x.UserId == userId, token);
                if (userInRoom != null) return new AddRoomUserResult();
                await _context.RoomUsers.AddAsync(new RoomUser()
                {
                    ConnectionId = parameters.ConnectionId,
                    UserId = userId,
                    RoomId = room.Id
                }, token);
            }
            else
            {
                var newRoom = new Room()
                {
                    Id = Guid.NewGuid(),
                    MeetingId = meetingId,
                };
                var roomUser = new RoomUser()
                {
                    RoomId =  newRoom.Id,
                    ConnectionId = parameters.ConnectionId,
                    UserId = userId
                };

                await _context.AddAsync(newRoom, token);
                await _context.AddAsync(roomUser, token);
            }
            await _context.SaveChangesAsync(token);
            return new AddRoomUserResult();
        }
    }
}
