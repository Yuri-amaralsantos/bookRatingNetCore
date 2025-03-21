using Microsoft.AspNetCore.Mvc;
using UserAuthApi.Services;
using UserAuthApi.DTOs;

[Route("api/reviews")]
[ApiController]
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

    [HttpGet("user/{username}")]
    public IActionResult GetReviewsByUser(string username)
    {
        var reviews = _reviewService.GetReviewsByUser(username);
        if (reviews.Count == 0)
        {
            return NotFound(new { message = "No reviews found for this user" });
        }
        return Ok(reviews);
    }
}
