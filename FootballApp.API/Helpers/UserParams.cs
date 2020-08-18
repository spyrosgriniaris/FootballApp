namespace FootballApp.API.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1; // returns 1 unless requested something else
        private int pageSize = 12;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }

        // filtering not to show my profile
        public int UserId { get; set; }
        public string Gender { get; set; }
        // end of filtering

         // additional filtering properties
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 45;
        public string SearchWord { get; set; }

        // end of additional filtering properties

        // likes functionality
        public bool Likees { get; set; } = false;
        public bool Likers { get; set; } = false;
        // end of likes functionality

        // position filtering
        public bool Goalkeeper { get; set; } = false;
        public bool Defender { get; set; } = false;
        public bool Midfielder { get; set; } = false;
        public bool Striker { get; set; } = false;
        // end of position filtering
        public string City { get; set; }
    }
}