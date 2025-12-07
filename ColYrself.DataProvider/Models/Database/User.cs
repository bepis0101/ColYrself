namespace ColYrself.DataProvider.Models.Database
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public ICollection<Password> Passwords { get; set; } = [];
        public ICollection<Meeting> OrganizedMeetings { get; set; } = [];
        public ICollection<Meeting> InvitedMeetings { get; set; } = [];
    }
}
