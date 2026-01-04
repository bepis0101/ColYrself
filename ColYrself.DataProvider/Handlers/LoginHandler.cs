using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Views;
using ColYrself.DataProvider.Services;
using MediatR;
using System.Security.Claims;

namespace ColYrself.DataProvider.Handlers
{
    public class LoginParameters : IRequest<LoginResult>
    {
        public LoginDetails Details { get; set; }
    }
    public class LoginResult
    {
        public UserLoginResponse UserLoginResponse { get; set; }
        public ClaimsPrincipal ClaimsPrincipal { get; set; }
    }
    public class LoginHandler : IRequestHandler<LoginParameters, LoginResult?>
    {
        private readonly ApplicationDbContext _context;
        public LoginHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<LoginResult?> Handle(LoginParameters parameters, CancellationToken token)
        {
            var service = new LoginService(_context);
            var response = await service.TryLogin(parameters.Details);
            if (response == null || response.Id == null) return null;
            var claims = ClaimGen.GeneratePrincipal(response);
            return new LoginResult() { UserLoginResponse = response, ClaimsPrincipal = claims };
        }
    }
}
