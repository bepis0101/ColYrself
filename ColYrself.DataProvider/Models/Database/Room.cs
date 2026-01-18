namespace ColYrself.DataProvider.Models.Database
{
    public class Room
    {
        public Guid Id { get; set; }
        public Guid MeetingId { get; set; }
        public Meeting Meeting { get; set; }
        public ICollection<RoomUser> RoomUsers { get; set; } = [];
    }
}
