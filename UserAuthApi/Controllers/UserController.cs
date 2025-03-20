using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using UserAuthApi.Data;
using UserAuthApi.Models;

namespace UserAuthApi.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 Get user's book list (protected route)
        [HttpGet("books")]
        [Authorize]
        public IActionResult GetUserBooks()
        {
            var username = User.Identity.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return Unauthorized("User not found");

            var userBooks = _context.UserBooks
                .Where(ub => ub.UserId == user.Id)
                .Select(ub => new { ub.Book.Id, ub.Book.Title, ub.Book.Author, ub.Book.Description })
                .ToList();

            return Ok(userBooks);
        }

        // 🔹 Add a book to user's book list
        [HttpPost("books/{bookId}")]
        [Authorize]
        public IActionResult AddBookToUser(int bookId)
        {
            var username = User.Identity.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return Unauthorized("User not found");

            if (_context.UserBooks.Any(ub => ub.UserId == user.Id && ub.BookId == bookId))
                return BadRequest("Book is already in your list");

            var book = _context.Books.Find(bookId);
            if (book == null) return NotFound("Book not found");

            _context.UserBooks.Add(new UserBooks { UserId = user.Id, BookId = bookId });
            _context.SaveChanges();

            return Ok("Book added to your list");
        }

        // 🔹 Remove a book from user's book list
        [HttpDelete("books/{bookId}")]
        [Authorize]
        public IActionResult RemoveBookFromUser(int bookId)
        {
            var username = User.Identity.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return Unauthorized("User not found");

            var userBook = _context.UserBooks.FirstOrDefault(ub => ub.UserId == user.Id && ub.BookId == bookId);
            if (userBook == null) return NotFound("Book not found in your list");

            _context.UserBooks.Remove(userBook);
            _context.SaveChanges();

            return Ok("Book removed from your list");
        }
    }
}
