using System.Collections.Generic;
using System.Linq;
using UserAuthApi.Data;
using UserAuthApi.Models;
using UserAuthApi.DTOs;

namespace UserAuthApi.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;

        public ReviewService(AppDbContext context)
        {
            _context = context;
        }

        public bool AddReview(AddReviewDto reviewDto, out string message)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == reviewDto.Username);
            if (user == null)
            {
                message = "User not found";
                return false;
            }

            var book = _context.Books.Find(reviewDto.BookId);
            if (book == null)
            {
                message = "Book not found";
                return false;
            }

            if (_context.Reviews.Any(r => r.UserId == user.Id && r.BookId == reviewDto.BookId))
            {
                message = "You have already reviewed this book";
                return false;
            }

            var review = new Review
            {
                UserId = user.Id,
                BookId = reviewDto.BookId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment
            };

            _context.Reviews.Add(review);
            _context.SaveChanges();

            message = "Review added successfully";
            return true;
        }

        public List<ReviewDto> GetReviewsForBook(int bookId)
        {
            return _context.Reviews
                .Where(r => r.BookId == bookId)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Username = r.User.Username,
                    BookTitle = r.Book.Title,
                    Rating = r.Rating,
                    Comment = r.Comment
                })
                .ToList();
        }

        public List<ReviewDto> GetReviewsByUser(string username)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return new List<ReviewDto>();

            return _context.Reviews
                .Where(r => r.UserId == user.Id)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Username = r.User.Username,
                    BookTitle = r.Book.Title,
                    Rating = r.Rating,
                    Comment = r.Comment
                })
                .ToList();
        }
    }
}
