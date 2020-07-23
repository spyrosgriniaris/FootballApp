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

        public ICollection<UserRole> UserRoles { get; set; }
    }
}