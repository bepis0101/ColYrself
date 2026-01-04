using ColYrself.DataProvider.Contexts;
using ColYrself.DataProvider.Models.Views;
using ColYrself.DataProvider.Services;
using MediatR;

namespace ColYrself.DataProvider.Handlers
{
    public class SignupParameters : IRequest<SignupResult>
    {
        public SignUpDetails SignUpDetails { get; set; }
    }
    public class SignupResult
    {
        public RegistartionStatus Status { get; set; }
    }
    public class SignupHandler : IRequestHandler<SignupParameters, SignupResult>
    {
        private readonly ApplicationDbContext _context;
        public SignupHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<SignupResult> Handle(SignupParameters parameters, CancellationToken token)
        {
            var registration = new RegistrationService(_context);
            var response = await registration.AuthorizeRegistration(parameters.SignUpDetails);
            return new SignupResult() { Status = response };
        }
    }
}
