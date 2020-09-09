namespace FootballApp.API.Helpers
{
    public class TeamParams
    {
          private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1; // returns 1 unless requested something else
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }
    }
}