using System;
using System.Collections.Generic;
using FootballApp.API.Models;

namespace FootballApp.API.Dtos
{
    public class MemberForDetailedDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PhotoUrl { get; set; } //main photo
        public string FullName { get; set; }
        public string PlaceOfBirth { get; set; }
        public int Height { get; set; }
        public string Citizenship { get; set; }
        public string Foot { get; set; }
        public string CurrentClub { get; set; }
        public ICollection<PhotosForDetailedDto> Photos { get; set; }
        public ICollection<PositionForDetailDto> Positions;
    }
}