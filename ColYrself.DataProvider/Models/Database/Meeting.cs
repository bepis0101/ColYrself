using ColYrself.DataProvider.Models.Database;

namespace ColYrself.MeetingService
{
    public class Meeting
    {
        public Guid id { get; set; }
        public DateOnly date {  get; set; }
        public TimeOnly time { get; set; }
        public User[] invited { get; set; } = [];
    }
}