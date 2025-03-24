import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addReview, fetchBooks, testAuth } from "../api";

function ReviewBook() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null); // Store authenticated user
  const [reviewForm, setReviewForm] = useState({
    rating: 1,
    comment: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      return;
    }

    testAuth(token)
      .then((data) => {
        if (data?.user) {
          setUser(data.user); // Store the username
        } else {
          setError("Authentication failed.");
        }
      })
      .catch(() => setError("Authentication request failed."));

    fetchBooks(token)
      .then((data) => {
        if (Array.isArray(data)) {
          const foundBook = data.find((b) => b.id === Number(bookId));
          if (foundBook) {
            setBook(foundBook);
          } else {
            setError("Book not found.");
          }
        } else {
          setError("Failed to fetch book details.");
        }
      })
      .catch(() => setError("Error fetching book details."));
  }, [bookId]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      return;
    }

    if (!user) {
      setError("User information not available.");
      return;
    }

    const reviewData = {
      username: user, // Use the authenticated username
      bookId: Number(bookId),
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
    };

    if (!reviewData.comment) {
      setError("Comment is required.");
      return;
    }

    const result = await addReview(token, reviewData);

    if (typeof result === "string") {
      setError(result);
    } else {
      navigate(`/book/${bookId}`);
    }
  };

  return (
    <div>
      <h1>Review Book</h1>
      {error && (
        <pre style={{ color: "red", whiteSpace: "pre-line" }}>{error}</pre>
      )}

      {book ? (
        <>
          <h2>
            {book.title} by {book.author}
          </h2>
          <p>
            Logged in as: <strong>{user || "Loading..."}</strong>
          </p>

          <form onSubmit={handleAddReview}>
            <label>
              Rating:
              <input
                type="number"
                min="1"
                max="5"
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, rating: e.target.value })
                }
                required
              />
            </label>

            <label>
              Commeant:
              <textarea
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                required
              />
            </label>

            <button type="submit">Submit Review</button>
          </form>
        </>
      ) : (
        <p>Loading book information...</p>
      )}
    </div>
  );
}

export default ReviewBook;
