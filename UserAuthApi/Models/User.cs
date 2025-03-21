using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UserAuthApi.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; } // Store hashed password

        // Many-to-Many relationship: Users can have multiple books, and books can be in multiple users' lists
        public List<UserBook> UserBooks { get; set; } = new List<UserBook>();

        // One-to-Many relationship: Users can write multiple reviews
        public List<Review> Reviews { get; set; } = new List<Review>();
    }
}
