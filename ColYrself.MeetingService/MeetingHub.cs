using MediatR;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using ColYrself.DataProvider.Handlers;
using Microsoft.AspNetCore.Authorization;
using ColYrself.DataProvider.Models.DTOs;

namespace ColYrself.MeetingService
{
    [Authorize]
    public class MeetingHub : Hub
    {
        private readonly IMediator _mediator;
        public MeetingHub(IMediator mediator)
        {
            _mediator = mediator;
        }
        private async Task<UserDto> GetCurrentUser()
        {
            var userId = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = Context.User.IsInRole("Admin");
            var id = Guid.Parse(userId);
            var user = await _mediator.Send(new GetUserParameters() { UserId = id, IsAdmin = isAdmin });
            return user.User;
        }

        private async Task<bool> IsUserAllowed(string meetingId)
        {
            var userId = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _mediator.Send(new IsUserAllowedParameters() { MeetingId = meetingId, UserId = userId });
            return result.IsUserAllowed;
        }

        private async Task LeaveMeetingInternal(string meetingId, UserDto user)
        {
            await Clients.OthersInGroup(meetingId).SendAsync("UserLeft", user, Context.ConnectionId);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, meetingId);

            await _mediator.Send(new DeleteUserFromRoomParameters()
            {
                MeetingId = meetingId,
                UserId = user.Id
            });

        }

        public async Task JoinMeeting(string meetingId)
        {
            if((await IsUserAllowed(meetingId)) == false)
            {
                return;
            }
            var user = await GetCurrentUser();
            if (user == null)
            {
                return;
            }
            var roomUsers = await _mediator.Send(new GetRoomUsersParameters()
            {
                MeetingId = meetingId
            });
            await Clients.Caller.SendAsync("ActiveUsers", roomUsers.ActiveUsers);
            await Groups.AddToGroupAsync(Context.ConnectionId, meetingId);
            await _mediator.Send(new AddRoomUserParameters()
            {
                MeetingId = meetingId,
                UserId = user.Id,
                ConnectionId = Context.ConnectionId
            });
            await Clients.OthersInGroup(meetingId).SendAsync("UserJoined", user, Context.ConnectionId);
        }
        public async Task SendOffer(string targetId, string offer)
        {
            await Clients.Client(targetId).SendAsync("ReceiveOffer", Context.ConnectionId, offer);
        }
        public async Task SendAnswer(string targetId, string answer)
        {
            await Clients.Client(targetId).SendAsync("ReceiveAnswer", Context.ConnectionId, answer);
        }
        public async Task SendIceCandidate(string targetId, string candidate)
        {
            await Clients.Client(targetId).SendAsync("ReceiveIceCandidate", Context.ConnectionId, candidate);
        }
        public async Task LeaveMeeting(string meetingId)
        {
            var user = await GetCurrentUser();
            await LeaveMeetingInternal(meetingId, user);
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var user = await GetCurrentUser();
            var meetings = await _mediator.Send(new GetRoomUserParameters() { UserId = user.Id });
            foreach (var meeting in meetings.MeetingIds)
            {
                await LeaveMeetingInternal(meeting, user);
            }
        }
    }
}
