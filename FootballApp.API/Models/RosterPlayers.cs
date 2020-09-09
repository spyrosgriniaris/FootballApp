namespace FootballApp.API.Models
{
    public class RosterPlayers
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public string FullName { get; set; }
        public int Age { get; set; }
        public string Position { get; set; }
        public string Foot { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
    }
}