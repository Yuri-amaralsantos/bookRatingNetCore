import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getUserBooks,
  testAuth,
  fetchBooks,
  addBookToUser,
  removeBookFromUser,
} from "../api";

function User() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

  const handleReviewRedirect = (bookId) => {
    navigate(`/review/${bookId}`);
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
                <button onClick={() => handleReviewRedirect(book.id)}>
                  Review
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
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul>
            {filteredBooks.map((book) => (
              <li key={`available-book-${book.id}`}>
                <Link to={`/book/${book.id}`}>{book.title}</Link> by{" "}
                {book.author}{" "}
                <button onClick={() => handleAddBook(book.id)}>Add</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}

export default User;
