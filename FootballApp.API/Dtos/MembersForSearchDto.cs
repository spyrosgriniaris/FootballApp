using System.Collections.Generic;
using FootballApp.API.Models;

namespace FootballApp.API.Dtos
{
    public class MembersForSearchDto
    {
        public int TotalCount { get; set; }
        public bool IncompleteResults { get; set; }
        public ICollection<MemberForListDto> Users {get; set; }

    }
}