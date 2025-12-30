using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Database;
using ColYrself.DataProvider.Models.DTOs;
using ColYrself.DataProvider.Models.Views;
using ColYrself.DataProvider.Services;
using ColYrself.Handlers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace ColYrself.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingsController : ControllerBase
    {
        private readonly IMediator _mediator;
        public MeetingsController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [Authorize]
        [HttpPost("Create")]
        public async Task<IActionResult> CreateMeeting([FromBody] MeetingDetails meeting)
        {
            var userId = UserService.GetUserId(HttpContext);
            var result =  await _mediator.Send(new CreateMeetingParameters() { Details = meeting, UserId = userId });
            if(result.Id == Guid.Empty)
            {
                return Forbid();
            }
            return Created();
        }

        [Authorize]
        [HttpDelete("Delete/{meetingId}")]
        public async Task<IActionResult> DeleteMeeting([FromRoute] string meetingId)
        {
            var userId = UserService.GetUserId(HttpContext);
            var result = await _mediator.Send(new DeleteMeetingParameters() { MeetingId = meetingId, UserId = userId });
            if (result.MeetingId == Guid.Empty)
            {
                return Forbid();
            }
            return NoContent();
        }

        [Authorize]
        [HttpGet("Active")]
        public async Task<IActionResult> GetMeetingsForCurrentUser()
        {
            var userId = UserService.GetUserId(HttpContext);
            var result = await _mediator.Send(new GetMeetingsParameters() { UserId = userId });
            return Ok(result.Meetings);
        }
        [Authorize]
        [HttpPut("Update/{meetingId}")]
        public async Task<IActionResult> UpdateMeeting([FromRoute] string meetingId, [FromBody] MeetingDetails details)
        {
            if (!Guid.TryParse(meetingId, out var id))
            {
                return BadRequest();
            }
            var userId = UserService.GetUserId(HttpContext);
            var result = await _mediator.Send(new UpdateMeetingParameters() 
            { 
                UserId = userId, 
                Details = details, 
                MeetingId = id 
            });

            if(result.MeetingId  == Guid.Empty)
            {
                return BadRequest();
            }
            return Created();
        }
        [Authorize]
        [HttpGet("{meetingId}")]
        public async Task<IActionResult> GetMeeting([FromRoute] string meetingId)
        {
            var userId = UserService.GetUserId(HttpContext);
            var result = await _mediator.Send(new GetMeetingParameters() { MeetingId = meetingId, UserId = userId });
            if(result.Meeting == null)
            {
                return Unauthorized();
            }
            return Ok(result.Meeting);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("")]
        public async Task<IActionResult> GetMeetings()
        {
            var userId = UserService.GetUserId(HttpContext);
            var result = await _mediator.Send(new GetAllMeetingsParameters()
            {
                UserId = userId
            });
            return Ok(result.Meetings);
        }
    }
}
