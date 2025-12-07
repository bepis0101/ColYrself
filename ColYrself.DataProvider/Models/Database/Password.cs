namespace ColYrself.DataProvider.Models.Database
{
    public class Password
    {
        public int Id { get; set; }
        public string PasswordHash { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}
