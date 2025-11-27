using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Database;
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
        private readonly MeetingContext _context;
        private readonly AccountDbContext _accountContext;
        public MeetingsController(MeetingContext context, AccountDbContext accountContext)
        {
            _context = context;
            _accountContext = accountContext;
        }
        [Authorize]
        [HttpPost("CreateMeeting")]
        public async Task<IActionResult> CreateMeeting([FromBody] MeetingDetails meeting)
        {
            var user = UserService.GetUser(HttpContext, _accountContext);
            if(user == null)
            {
                return Unauthorized();
            }
            var date = DateOnly.FromDateTime(DateTime.Parse(meeting.Date));
            var dbMeeting = new Meeting()
            {
                id = Guid.NewGuid(),
                name = meeting.Name,
                date = date,
                time = TimeOnly.Parse(meeting.Time),
                isPrivate = meeting.IsPrivate,
                organizerId = user.id,
                invitedIds = meeting.Invited
                    .Select(x => Guid.Parse(x))
                    .ToArray()
                    
            };
            await _context.AddAsync(dbMeeting);
            await _context.SaveChangesAsync();
            return Ok();
        }
        
        [Authorize]
        [HttpDelete("DeleteMeeting")]
        public async Task<IActionResult> DeleteMeeting([FromRoute] string meetingId)
        {
            var user = UserService.GetUser(HttpContext, _accountContext);
            if (user == null)
            {
                return Unauthorized();
            }
            var meetingGuid = Guid.Parse(meetingId);
            if(meetingGuid == Guid.Empty)
            {
                return BadRequest();
            }
            var meeting = await _context.PlannedMeetings.FirstOrDefaultAsync(x => x.id == meetingGuid);
            if (meeting == null)
            {
                return BadRequest();
            }
            if(meeting.organizerId != user.id)
            {
                return Unauthorized();
            }
            _context.Remove(meeting);
            await _context.SaveChangesAsync();
            return Ok();
        }
        [Authorize]
        [HttpGet("GetAllMeetings")]
        public IActionResult GetAllMeetings()
        {
            return Ok(_context.PlannedMeetings.ToArray());
        }

        [Authorize]
        [HttpGet("GetAllMyMeetings")]
        public IActionResult GetMeetingsForCurrentUser()
        {
            var user = UserService.GetUser(HttpContext, _accountContext);
            if(user == null)
            {
                return Unauthorized();
            }
            var meetings = _context.PlannedMeetings
                .Where(x => x.invitedIds.Contains(user.id) || x.organizerId == user.id)
                .ToArray();

            return Ok(meetings);
        }
        [Authorize]
        [HttpPut("UpdateMeeting")]
        public async Task<IActionResult> UpdateMeeting(string meetingId, [FromBody] MeetingDetails details)
        {
            var user = UserService.GetUser(HttpContext, _accountContext);
            var id = Guid.Parse(meetingId);
            if (id == Guid.Empty) 
            {
                return BadRequest();
            }
            var meeting = await _context.PlannedMeetings.FirstOrDefaultAsync(x => x.id == id);
            if (meeting == null)
            {
                return NotFound();
            }
            meeting.date = DateOnly.Parse(details.Date);
            meeting.time = TimeOnly.Parse(details.Time);
            meeting.isPrivate = details.IsPrivate;
            meeting.invitedIds = details.Invited.Select(x => Guid.Parse(x)).ToArray();
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
