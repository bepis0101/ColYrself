namespace ColYrself.DataProvider.Models.Database
{
    public class RoomUser
    {
        public int Id { get; set; }
        public Guid RoomId { get; set; }
        public string ConnectionId { get; set; }
        public Room Room { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}
