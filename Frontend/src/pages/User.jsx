import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getUserBooks,
  testAuth,
  fetchBooks,
  addBookToUser,
  removeBookFromUser,
} from "../api";
import "./User.css";

function User() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

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
          ? setFilteredBooks(data)
          : setError("Failed to fetch books.")
      )
      .catch(() => setError("Error fetching books."));
  }, []);

  const handleAddBook = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await addBookToUser(token, bookId);
    updateBooks();
  };

  const handleRemoveBook = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await removeBookFromUser(token, bookId);
    updateBooks();
  };

  const updateBooks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setBooks(await getUserBooks(token));
  };

  return (
    <div className="user-container">
      <h1 className="user-title">User Profile</h1>
      {error && (
        <pre style={{ color: "red", whiteSpace: "pre-line" }}>{error}</pre>
      )}

      {user ? (
        <>
          <h2>Your Books</h2>
          <div className="books-grid">
            {books.map((book) => (
              <div key={`user-book-${book.id}`} className="book-card">
                <img src="image.jpg" alt={book.title} className="book-image" />
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
                <button
                  className="user-books-button"
                  onClick={() => handleRemoveBook(book.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <h2>All Books</h2>
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="books-grid">
            {filteredBooks
              .filter((book) =>
                book.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((book) => (
                <div key={`available-book-${book.id}`} className="book-card">
                  <img
                    src="image.jpg"
                    alt={book.title}
                    className="book-image"
                  />
                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  <button
                    className="all-books-button"
                    onClick={() => handleAddBook(book.id)}
                  >
                    Add
                  </button>
                </div>
              ))}
          </div>
        </>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}

export default User;
