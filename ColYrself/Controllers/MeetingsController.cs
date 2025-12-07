using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Database;
using ColYrself.DataProvider.Models.DTOs;
using ColYrself.DataProvider.Models.Views;
using ColYrself.DataProvider.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ColYrself.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public MeetingsController(ApplicationDbContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpPost("Create")]
        public async Task<IActionResult> CreateMeeting([FromBody] MeetingDetails meeting)
        {
            var user = UserService.GetUserWithMeetings(HttpContext, _context);
            if(user == null)
            {
                return Unauthorized();
            }
            var date = DateOnly.FromDateTime(DateTime.Parse(meeting.Date));
            var users = meeting.Invited.Select(x => new User() { Id = Guid.Parse(x)});
            _context.AttachRange(users);
            var dbMeeting = new Meeting()
            {
                Id = Guid.NewGuid(),
                Name = meeting.Name,
                Date = date,
                Time = TimeOnly.Parse(meeting.Time),
                IsPrivate = meeting.IsPrivate,
                OrganizerId = user.Id,
                InvitedUsers = users.ToList(),
                Organizer = user
            };
            await _context.AddAsync(dbMeeting);
            await _context.SaveChangesAsync();
            return Ok();
        }
        
        [Authorize]
        [HttpDelete("Delete/{meetingId}")]
        public async Task<IActionResult> DeleteMeeting([FromRoute] string meetingId)
        {
            var user = UserService.GetUser(HttpContext, _context);
            if (user == null)
            {
                return Unauthorized();
            }
            var meetingGuid = Guid.Parse(meetingId);
            if(meetingGuid == Guid.Empty)
            {
                return BadRequest();
            }
            var meeting = await _context.Meetings.FirstOrDefaultAsync(x => x.Id == meetingGuid);
            if (meeting == null)
            {
                return BadRequest();
            }
            if(meeting.OrganizerId != user.Id)
            {
                return Forbid();
            }
            _context.Remove(meeting);
            await _context.SaveChangesAsync();
            return Ok();
        }
        [Authorize]
        [HttpGet("GetAllMeetings")]
        public IActionResult GetAllMeetings()
        {
            return Ok(_context.Meetings.ToArray());
        }

        [Authorize]
        [HttpGet("Active")]
        public IActionResult GetMeetingsForCurrentUser()
        {
            var user = UserService.GetUserWithMeetings(HttpContext, _context);
            if(user == null)
            {
                return Unauthorized();
            }
            var invitedMeetings = user.InvitedMeetings.ToArray();
            var organizedMeetings = user.OrganizedMeetings.ToArray();
            var meetings = invitedMeetings
                .Concat(organizedMeetings)
                .Distinct()
                .Select(m => new MeetingDto()
                {
                    Date = m.Date,
                    Id = m.Id,
                    InvitedUserIds = m.InvitedUsers.Select(u => u.Id).ToList(),
                    IsPrivate = m.IsPrivate,
                    Name = m.Name,
                    OrganizerId = m.OrganizerId,
                    Time = m.Time
                });
            return Ok(meetings);
        }
        [Authorize]
        [HttpPut("Update")]
        public async Task<IActionResult> UpdateMeeting(string meetingId, [FromBody] MeetingDetails details)
        {
            if (!Guid.TryParse(meetingId, out var id))
            {
                return BadRequest();
            }

            var user = UserService.GetUser(HttpContext, _context);

            var meeting = await _context.Meetings
                .Include(x => x.InvitedUsers)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (meeting == null)
            {
                return NotFound();
            }

            if (meeting.OrganizerId != user.Id)
            {
                return Forbid();
            }

            if (DateOnly.TryParse(details.Date, out var date)) meeting.Date = date;
            if (TimeOnly.TryParse(details.Time, out var time)) meeting.Time = time;
            meeting.IsPrivate = details.IsPrivate;

            meeting.InvitedUsers.Clear();

            var newUserIds = details.Invited
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
            return Ok();
        }
    }
}
