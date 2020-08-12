using System;

namespace FootballApp.API.Dtos
{
    public class MemberForListDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Gender { get; set; }
        public int  Age { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PhotoUrl { get; set; } //user main photo
        public int TotalLikes { get; set; } = 0;
        public string FullName { get; set; }
        public string PlaceOfBirth { get; set; }
        public int Height { get; set; }
        public string Citizenship { get; set; }
        public string Foot { get; set; }
        public string CurrentClub { get; set; }
    }
}