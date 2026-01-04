using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.DTOs;
using ColYrself.DataProvider.Services;
using MediatR;

namespace ColYrself.DataProvider.Handlers
{
    public class GetUserParameters : IRequest<GetUserResult>
    {
        public Guid UserId { get; set; }
        public bool IsAdmin { get; set; }
    }
    public class GetUserResult
    {
        public UserDto User { get; set; }
    }
    public class GetUserHandler : IRequestHandler<GetUserParameters, GetUserResult> 
    {
        private readonly ApplicationDbContext _context;
        public GetUserHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<GetUserResult> Handle(GetUserParameters parameters, CancellationToken token)
        {
            var user = UserService.GetUser(_context, parameters.UserId);
            if (user == null)
            {
                return null;
            }
            return new GetUserResult()
            {
                User = new UserDto()
                {
                    Id = user.Id.ToString(),
                    Email = user.Email,
                    Username = user.Username,
                    IsAdmin = parameters.IsAdmin
                }
            };
        }
    }
}
