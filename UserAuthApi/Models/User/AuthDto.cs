using System.ComponentModel.DataAnnotations;

namespace UserAuthApi.Models
{
    public class AuthRequestDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
