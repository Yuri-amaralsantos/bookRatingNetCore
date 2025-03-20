using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserAuthApi.Services;

namespace UserAuthApi.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("books")]
        [Authorize]
        public IActionResult GetUserBooks()
        {
            var username = User.Identity.Name;
            var books = _userService.GetUserBooks(username);

            if (books == null) return Unauthorized("User not found");

            return Ok(books);
        }

        [HttpPost("books/{bookId}")]
        [Authorize]
        public IActionResult AddBookToUser(int bookId)
        {
            var username = User.Identity.Name;
            if (_userService.AddBookToUser(username, bookId, out string message))
            {
                return Ok(message);
            }
            return BadRequest(message);
        }

        [HttpDelete("books/{bookId}")]
        [Authorize]
        public IActionResult RemoveBookFromUser(int bookId)
        {
            var username = User.Identity.Name;
            if (_userService.RemoveBookFromUser(username, bookId, out string message))
            {
                return Ok(message);
            }
            return BadRequest(message);
        }
    }
}
