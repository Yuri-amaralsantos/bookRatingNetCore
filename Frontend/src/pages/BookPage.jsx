import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getBookById,
  getReviewsForBook,
  removeReview,
  addReview,
} from "../api"; // Import API functions

function BookPage() {
  const { bookId } = useParams(); // Get book ID from URL
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [newReview, setNewReview] = useState(""); // State for new review input
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
    if (!newReview.trim()) {
      setError("Review cannot be empty.");
      return;
    }

    const username = localStorage.getItem("username"); // Get username from localStorage
    if (!username) {
      setError("User is not authenticated.");
      return;
    }

    const reviewData = { bookId, comment: newReview, username }; // Include username

    const result = await addReview(token, reviewData);
    if (typeof result === "string") {
      setError(result); // Show error if adding review fails
    } else {
      setReviews([...reviews, result]); // Append new review
      setNewReview(""); // Clear input field
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!book) return <p>Loading...</p>;

  return (
    <div>
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

      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <strong>{review.username}:</strong> {review.comment}
              {review.username === currentUser && (
                <button
                  onClick={() => handleRemoveReview(review.id)}
                  style={{ marginLeft: "10px", color: "red" }}
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
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your review..."
          rows="3"
          cols="40"
        ></textarea>
        <br />
        <button onClick={handleAddReview}>Submit Review</button>
      </div>

      <Link to="/books">Back to Books</Link>
    </div>
  );
}

export default BookPage;
