namespace ColYrself.DataProvider.Models.Database
{
    public class Meeting
    {
        public Guid id { get; set; }
        public string name { get; set; }
        public required User organizer { get; set; }
        public Guid organizerId { get; set; }
        public DateOnly date {  get; set; }
        public TimeOnly time { get; set; }
        public Guid[] invitedIds { get; set; } = [];
        public bool isPrivate { get; set; } = true;
    }
}