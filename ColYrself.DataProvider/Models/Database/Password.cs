namespace ColYrself.DataProvider.Models.Database
{
    public class Password
    {
        public int id { get; set; }
        public string password { get; set; }
        public Guid user_id { get; set; }
    }
}
