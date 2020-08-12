using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace FootballApp.API.Models
{
    public class User : IdentityUser<int> // int stands for using int for id and not string which is the default
    {
        // public int Id { get; set; }
        // public string Username { get; set; }
        // public byte[] PasswordHash { get; set; }
        // public byte[] PasswordSalt { get; set; }
        // added for extending the user model
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public int TotalLikes { get; set; }
        public string FullName { get; set; }
        public string PlaceOfBirth { get; set; }
        public int Height { get; set; }
        public string Citizenship { get; set; }
        public string Foot { get; set; }
        public string CurrentClub { get; set; }
        public ICollection<Photo> Photos { get; set; }

        public ICollection<UserRole> UserRoles { get; set; }
        public ICollection<PlayerPosition> Positions { get; set; }

        // Likes Functionality
        public ICollection<Like> Likers { get; set; }
        public ICollection<Like> Likees { get; set; }
    }
}