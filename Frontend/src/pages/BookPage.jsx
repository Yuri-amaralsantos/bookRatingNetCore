import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getBookById,
  getReviewsForBook,
  removeReview,
  addReview,
} from "../api"; // Import API functions
import "./BookPage.css"; // Import the styles

function BookPage() {
  const { bookId } = useParams(); // Get book ID from URL
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [newReview, setNewReview] = useState({ comment: "", rating: 1 }); // State for new review input
  const [error, setError] = useState("");
  const token = localStorage.getItem("token"); // Retrieve token for authentication
  const currentUser = localStorage.getItem("username");

  useEffect(() => {
    if (bookId) {
      // Fetch book details
      getBookById(token, bookId)
        .then((data) => setBook(data))
        .catch(() => setError("Failed to fetch book details."));

      // Fetch book reviews
      getReviewsForBook(token, bookId)
        .then((data) => setReviews(data))
        .catch(() => setError("Failed to fetch book reviews."));
    }
  }, [bookId, token]);

  const handleRemoveReview = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmDelete) return;

    const result = await removeReview(token, reviewId);
    if (typeof result === "string") {
      setError(result); // Show error if deletion fails
    } else {
      setReviews(reviews.filter((review) => review.id !== reviewId)); // Remove deleted review from UI
    }
  };

  const handleAddReview = async () => {
    if (!newReview.comment.trim()) {
      setError("Review cannot be empty.");
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      setError("User is not authenticated.");
      return;
    }

    const reviewData = {
      bookId,
      comment: newReview.comment,
      rating: Number(newReview.rating), // Ensure it's a number
      username,
    };

    const result = await addReview(token, reviewData);
    if (typeof result === "string") {
      setError(result);
      return;
    }

    // Fetch updated reviews list
    getReviewsForBook(token, bookId)
      .then((data) => setReviews(data))
      .catch(() => setError("Failed to refresh reviews."));

    setNewReview({ comment: "", rating: 1 });
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!book) return <p>Loading...</p>;

  function renderStars(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating); // Fill stars and empty stars
  }

  return (
    <div className="book-page">
      <h1>{book.title}</h1>
      <p>
        <strong>Author:</strong> {book.author}
      </p>
      <p>
        <strong>Description:</strong> {book.description}
      </p>
      <p>
        <strong>Published:</strong> {book.publishedYear}
      </p>

      <div className="review-section">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>
                <strong>{review.username}:</strong> {review.comment} <br />
                <span className="stars">{renderStars(review.rating)}</span>
                {review.username === currentUser && (
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveReview(review.id)}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}

        {/* Add Review Form */}
        <div>
          <h3>Add a Review</h3>
          <label>
            Rating:
            <input
              type="number"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: e.target.value })
              }
            />
          </label>
          <br />
          <textarea
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            placeholder="Write your review..."
            rows="3"
          ></textarea>
          <br />
          <button onClick={handleAddReview}>Submit Review</button>
        </div>
      </div>

      <Link to="/books">Back to Books</Link>
    </div>
  );
}

export default BookPage;
