namespace ColYrself.DataProvider.Models.Database
{
    public class User
    {
        public Guid id { get; set; }
        public string username { get; set; }
        public string email { get; set; }
        public ICollection<Meeting> organizedMeetings { get; set; } = [];
    }
}
