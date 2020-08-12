using System;

namespace FootballApp.API.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool isMain { get; set; }
        // to response from cloudinary has a public id
        public string PublicId { get; set; }
        //=============================================
        public bool isApproved { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
    }
}