using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ColYrself.DataProvider.Handlers
{
    public class GetUsersParameters : IRequest<GetUsersResult>
    {
        public Guid UserId { get; set; }
    }
    public class GetUsersResult
    {
        public ICollection<UserDto> Users { get; set; }
    }
    public class GetUsersHandler : IRequestHandler<GetUsersParameters, GetUsersResult>
    {
        private readonly ApplicationDbContext _context;
        public GetUsersHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<GetUsersResult> Handle(GetUsersParameters parameters, CancellationToken token)
        {
            var users = await _context.Users
                .Where(x => x.Id != parameters.UserId)
                .Select(x => new UserDto()
                {
                    Email = x.Email,
                    Id = x.Id.ToString().ToLower(),
                    Username = x.Username
                })
                .OrderBy(x => x.Username)
                .ToListAsync(token);

            return new GetUsersResult() { Users = users };
        }
    }
}
