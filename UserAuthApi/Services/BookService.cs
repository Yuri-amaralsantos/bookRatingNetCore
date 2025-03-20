using System.Collections.Generic;
using System.Linq;
using UserAuthApi.Data;
using UserAuthApi.Models;

namespace UserAuthApi.Services
{
    public class BookService
    {
        private readonly AppDbContext _context;

        public BookService(AppDbContext context)
        {
            _context = context;
        }

        public List<Book> GetAllBooks()
        {
            return _context.Books.ToList();
        }

        public Book GetBookById(int id)
        {
            return _context.Books.Find(id);
        }

        public void CreateBook(Book book)
        {
            _context.Books.Add(book);
            _context.SaveChanges();
        }

        public bool UpdateBook(int id, Book updatedBook)
        {
            var book = _context.Books.Find(id);
            if (book == null) return false;

            book.Title = updatedBook.Title;
            book.Author = updatedBook.Author;
            book.Description = updatedBook.Description;
            _context.SaveChanges();
            return true;
        }

        public bool DeleteBook(int id)
        {
            var book = _context.Books.Find(id);
            if (book == null) return false;

            _context.Books.Remove(book);
            _context.SaveChanges();
            return true;
        }
    }
}
