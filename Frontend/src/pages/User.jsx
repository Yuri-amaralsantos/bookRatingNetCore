import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getUserBooks,
  testAuth,
  fetchBooks,
  addBookToUser,
  removeBookFromUser,
  getUserReviews,
  addReview,
} from "../api";

function User() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    bookId: "",
    rating: 1,
    comment: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      return;
    }

    testAuth(token)
      .then((data) =>
        data?.user ? setUser(data.user) : setError("Authentication failed.")
      )
      .catch(() => setError("Authentication request failed."));

    getUserBooks(token)
      .then((data) =>
        Array.isArray(data)
          ? setBooks(data)
          : setError("Failed to fetch user's books.")
      )
      .catch(() => setError("Error fetching user books."));

    fetchBooks(token)
      .then((data) =>
        Array.isArray(data)
          ? setFilteredBooks(data) // Now this contains all books
          : setError("Failed to fetch books.")
      )
      .catch(() => setError("Error fetching books."));

    getUserReviews(token)
      .then((data) =>
        Array.isArray(data)
          ? setReviews(data)
          : setError("Failed to fetch user reviews.")
      )
      .catch(() => setError("Error fetching user reviews."));
  }, []);

  const handleAddBook = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      return;
    }

    if (books.some((book) => book.id === bookId)) {
      setError("Book is already in your list.");
      return;
    }

    const result = await addBookToUser(token, bookId);
    if (typeof result === "string") {
      setError(result);
    } else {
      setBooks([...books, result]); // Update books list
    }
  };

  const handleRemoveBook = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      return;
    }

    const result = await removeBookFromUser(token, bookId);
    if (typeof result === "string") {
      setError(result);
    } else {
      setBooks(books.filter((book) => book.id !== bookId)); // Remove book from list
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      return;
    }

    const reviewData = {
      bookId: Number(reviewForm.bookId),
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
      username: user,
    };

    if (!reviewData.username) {
      setError("username required");
      return;
    }

    if (!reviewData.bookId || !reviewData.comment) {
      setError("Book and comment are required.");
      return;
    }

    const result = await addReview(token, reviewData);

    if (typeof result === "string") {
      setError(result);
    } else {
      setReviews([...reviews, result]);
      setReviewForm({ bookId: "", rating: 1, comment: "" });
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      {error && (
        <pre style={{ color: "red", whiteSpace: "pre-line" }}>{error}</pre>
      )}

      {user ? (
        <>
          <p>
            Welcome, <strong>{user.name}</strong>!
          </p>

          <h2>Your Books</h2>
          <ul>
            {books.map((book) => (
              <li key={`user-book-${book.id}`}>
                <Link to={`/book/${book.id}`}>{book.title}</Link> by{" "}
                {book.author}{" "}
                <button onClick={() => handleRemoveBook(book.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <h2>Available Books</h2>
          <ul>
            {filteredBooks.map((book) => (
              <li key={`available-book-${book.id}`}>
                <Link to={`/book/${book.id}`}>{book.title}</Link> by{" "}
                {book.author}{" "}
                <button onClick={() => handleAddBook(book.id)}>Add</button>
              </li>
            ))}
          </ul>

          <h2>Add a Review</h2>
          <form onSubmit={handleAddReview}>
            <label>
              Select Book:
              <select
                value={reviewForm.bookId}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, bookId: e.target.value })
                }
                required
              >
                <option value="">-- Select a book --</option>
                {filteredBooks.map((book) => (
                  <option key={`select-book-${book.id}`} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </label>

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
              Comment:
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

          <h2>Your Reviews</h2>
          {reviews.length > 0 ? (
            <ul>
              {reviews.map((review) => (
                <li key={`review-${review.id}`}>
                  <strong>{review.bookTitle}</strong>: {review.comment} - ⭐
                  {review.rating}
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}
        </>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}

export default User;
