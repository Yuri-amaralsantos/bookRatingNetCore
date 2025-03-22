using System.Collections.Generic;
using UserAuthApi.DTOs;

namespace UserAuthApi.Services
{
    public interface IReviewService
    {
        bool AddReview(AddReviewDto reviewDto, out string message);
        List<ReviewDto> GetReviewsForBook(int bookId);
        List<ReviewDto> GetReviewsByUser(string username);
        bool DeleteReview(int reviewId, out string message);

    }
}
