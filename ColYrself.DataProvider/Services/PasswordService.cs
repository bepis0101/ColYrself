using BC = BCrypt.Net;
namespace ColYrself.DataProvider.Services
{
    public class PasswordService
    {
        public static string HashPassword(string password)
        {
            return BC.BCrypt.HashPassword(password);
        }

        public static bool VerifyPassword(string password, string hash)
        {
            return BC.BCrypt.Verify(password, hash);
        }
    }
}
