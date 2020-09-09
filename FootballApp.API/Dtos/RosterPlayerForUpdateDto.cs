namespace FootballApp.API.Dtos
{
    public class RosterPlayerForUpdateDto
    {
        public int TeamId { get; set; }
        public string FullName { get; set; }
        public int Age { get; set; }
        public string Position { get; set; }
        public string Foot { get; set; }
    }
}