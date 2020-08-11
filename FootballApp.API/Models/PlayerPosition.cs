namespace FootballApp.API.Models
{
    public class PlayerPosition
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Position { get; set; }
        public User User { get; set; }
    }
}