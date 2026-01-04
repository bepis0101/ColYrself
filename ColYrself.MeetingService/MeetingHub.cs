using MediatR;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using ColYrself.DataProvider.Handlers;
using Microsoft.AspNetCore.Authorization;

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
        public async Task JoinMeeting(string meetingId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, meetingId);
            var userId = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = Context.User.IsInRole("Admin");
            var id = Guid.Parse(userId);
            var user = await _mediator.Send(new GetUserParameters() { UserId = id, IsAdmin = isAdmin });
            if(user == null)
            {
                return;
            }
            await Clients.OthersInGroup(meetingId).SendAsync("UserJoined", user.User);
        }
        public async Task SendOffer(string meetingId, string offer)
        {
            await Clients.OthersInGroup(meetingId).SendAsync("ReceiveOffer", Context.ConnectionId, offer);
        }
        public async Task SendAnswer(string meetingId, string answer)
        {
            await Clients.OthersInGroup(meetingId).SendAsync("ReceiveAnswer", Context.ConnectionId, answer);
        }
        public async Task SendIceCandidate(string meetingId, string candidate)
        {
            await Clients.OthersInGroup(meetingId).SendAsync("ReceiveIceCandidate", Context.ConnectionId, candidate);
        }
        public async Task LeaveMeeting(string meetingId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, meetingId);
            var userId = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = Context.User.IsInRole("Admin");
            var id = Guid.Parse(userId);
            var user = await _mediator.Send(new GetUserParameters() { UserId = id, IsAdmin = isAdmin });
            if (user == null)
            {
                return;
            }
            await Clients.OthersInGroup(meetingId).SendAsync("UserLeft", user.User);
        }
    }
}
