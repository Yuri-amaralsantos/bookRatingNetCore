using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UserAuthApi.Models
{
    public class Book
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        public string Description { get; set; }

        // Many-to-Many relationship: Books can be in multiple users' lists
        public List<UserBook> UserBooks { get; set; } = new List<UserBook>();

        // One-to-Many relationship: Books can have multiple reviews
        public List<Review> Reviews { get; set; } = new List<Review>();
    }
}
