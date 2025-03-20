using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserAuthApi.Models;
using UserAuthApi.Services;

namespace UserAuthApi.Controllers
{
    [ApiController]
    [Route("api/books")]
    public class BookController : ControllerBase
    {
        private readonly BookService _bookService;

        public BookController(BookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet]
        public IActionResult GetBooks()
        {
            return Ok(_bookService.GetAllBooks());
        }

        [HttpGet("{id}")]
        public IActionResult GetBook(int id)
        {
            var book = _bookService.GetBookById(id);
            if (book == null) return NotFound("Book not found");
            return Ok(book);
        }

        [HttpPost]
        [Authorize]
        public IActionResult CreateBook([FromBody] Book book)
        {
            _bookService.CreateBook(book);
            return Ok("Book created successfully");
        }

        [HttpPut("{id}")]
        [Authorize]
        public IActionResult UpdateBook(int id, [FromBody] Book updatedBook)
        {
            if (!_bookService.UpdateBook(id, updatedBook))
                return NotFound("Book not found");

            return Ok("Book updated successfully");
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteBook(int id)
        {
            if (!_bookService.DeleteBook(id))
                return NotFound("Book not found");

            return Ok("Book deleted successfully");
        }
    }
}
