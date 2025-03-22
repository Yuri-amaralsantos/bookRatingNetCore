using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserAuthApi.Models;
using UserAuthApi.Services;
using UserAuthApi.DTOs;

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
        public IActionResult CreateBook([FromBody] BookDto bookDto)
        {
            var newBook = new Book
            {
                Title = bookDto.Title,
                Author = bookDto.Author,
                Description = bookDto.Description,
                PublishedYear = bookDto.PublishedYear
            };

            _bookService.CreateBook(newBook);
            return Ok("Book created successfully");
        }
    }
}
