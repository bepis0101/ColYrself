namespace ColYrself.DataProvider.Models.Database
{
    public class Meeting
    {
        // Properties
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateOnly Date {  get; set; }
        public TimeOnly Time { get; set; }
        public bool IsPrivate { get; set; } = true;
        // Navigation properties
        public Guid OrganizerId { get; set; }
        public User Organizer { get; set; }
        public ICollection<User> InvitedUsers { get; set; } = [];
        public Room Room { get; set; }
    }
}