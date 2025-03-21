namespace UserAuthApi.DTOs
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string BookTitle { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }

    public class AddReviewDto
    {
        public string Username { get; set; }
        public int BookId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
}
