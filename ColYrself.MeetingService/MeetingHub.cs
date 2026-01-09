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

        public async Task JoinMeeting(string meetingId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, meetingId);
            var user = await GetCurrentUser();
            if (user == null)
            {
                return;
            }
            await Clients.OthersInGroup(meetingId).SendAsync("UserJoined", user, Context.ConnectionId);
        }
        public async Task SendOffer(string targetId, string offer)
        {
            var user = await GetCurrentUser();
            await Clients.Client(targetId).SendAsync("ReceiveOffer", user, offer, targetId);
        }
        public async Task SendAnswer(string targetId, string answer)
        {
            var user = await GetCurrentUser();
            await Clients.Client(targetId).SendAsync("ReceiveAnswer", user, answer, targetId);
        }
        public async Task SendIceCandidate(string targetId, string candidate)
        {
            var user = await GetCurrentUser();
            await Clients.Client(targetId).SendAsync("ReceiveIceCandidate", user, candidate, targetId);
        }
        public async Task LeaveMeeting(string meetingId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, meetingId);
            var user = await GetCurrentUser();
            await Clients.OthersInGroup(meetingId).SendAsync("UserLeft", user, Context.ConnectionId);
        }
    }
}
