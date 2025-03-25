using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserAuthApi.Services;
using UserAuthApi.DTOs;
using System.Security.Claims;

[Route("api/reviews")]
[ApiController]
[Authorize] // Ensures only authenticated users can access these endpoints
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpPost("add")]
    public IActionResult AddReview([FromBody] AddReviewDto reviewDto)
    {
        var username = User.FindFirstValue(ClaimTypes.Name); // Get authenticated user's username
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        reviewDto.Username = username; // Ensure the review is linked to the authenticated user

        // Manual validation of required fields
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(reviewDto.Comment))
        {
            errors.Add("Comment is required.");
        }
        if (reviewDto.BookId <= 0)
        {
            errors.Add("Invalid BookId.");
        }

        if (errors.Any())
        {
            return BadRequest(new { message = "Validation failed", errors });
        }

        if (_reviewService.AddReview(reviewDto, out string message))
        {
            return Ok(new { message });
        }

        return BadRequest(new { message });
    }



    [HttpGet("book/{bookId}")]
    public IActionResult GetReviewsForBook(int bookId)
    {
        var reviews = _reviewService.GetReviewsForBook(bookId);
        return Ok(reviews);
    }

    [HttpGet("user")] // Removed {username} from the route
    public IActionResult GetReviewsByUser()
    {
        var username = User.FindFirstValue(ClaimTypes.Name); // Get authenticated user's username
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var reviews = _reviewService.GetReviewsByUser(username);
        
        // Return an empty array instead of 404 if no reviews are found
        return Ok(reviews.Any() ? reviews : new List<object>());
    }

    [HttpDelete("remove/{reviewId}")]
    public IActionResult DeleteReview(int reviewId)
    {
        if (_reviewService.DeleteReview(reviewId, out string message))
        {
            return Ok(new { message });
        }
        return BadRequest(new { message });
    }
}
