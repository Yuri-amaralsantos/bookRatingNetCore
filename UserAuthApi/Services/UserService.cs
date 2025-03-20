using System.Collections.Generic;
using System.Linq;
using UserAuthApi.Data;
using UserAuthApi.Models;

namespace UserAuthApi.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public List<object> GetUserBooks(string username)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return null;

            return _context.UserBooks
                .Where(ub => ub.UserId == user.Id)
                .Select(ub => new { ub.Book.Id, ub.Book.Title, ub.Book.Author, ub.Book.Description })
                .ToList<object>();
        }

        public bool AddBookToUser(string username, int bookId, out string message)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null)
            {
                message = "User not found";
                return false;
            }

            if (_context.UserBooks.Any(ub => ub.UserId == user.Id && ub.BookId == bookId))
            {
                message = "Book is already in your list";
                return false;
            }

            var book = _context.Books.Find(bookId);
            if (book == null)
            {
                message = "Book not found";
                return false;
            }

            _context.UserBooks.Add(new UserBooks { UserId = user.Id, BookId = bookId });
            _context.SaveChanges();

            message = "Book added to your list";
            return true;
        }

        public bool RemoveBookFromUser(string username, int bookId, out string message)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null)
            {
                message = "User not found";
                return false;
            }

            var userBook = _context.UserBooks.FirstOrDefault(ub => ub.UserId == user.Id && ub.BookId == bookId);
            if (userBook == null)
            {
                message = "Book not found in your list";
                return false;
            }

            _context.UserBooks.Remove(userBook);
            _context.SaveChanges();

            message = "Book removed from your list";
            return true;
        }
    }
}
