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

        public int PublishedYear { get; set; } // Add this field

        // Relationships
        public List<UserBook> UserBooks { get; set; } = new List<UserBook>();
        public List<Review> Reviews { get; set; } = new List<Review>();
    }
}
