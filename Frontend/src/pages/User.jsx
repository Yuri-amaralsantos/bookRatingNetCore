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
  const [books, setBooks] = useState([]); // User's books
  const [filteredBooks, setFilteredBooks] = useState([]); // All books
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
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          setError("Failed to fetch user's books.");
        }
      })
      .catch(() => setError("Error fetching user books."));

    fetchBooks(token)
      .then((data) => {
        if (Array.isArray(data)) {
          setFilteredBooks(data);
        } else {
          setError("Failed to fetch books.");
        }
      })
      .catch(() => setError("Error fetching books."));
  }, []);

  const updateBooks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const updatedBooks = await getUserBooks(token);
    console.log("Updated books:", updatedBooks);
    setBooks(updatedBooks); // Only updates books without triggering full re-fetch
  };

  const handleAddBook = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const result = await addBookToUser(token, bookId);

    setError(result);
    updateBooks();
  };

  const handleRemoveBook = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const result = await removeBookFromUser(token, bookId);
    console.log(typeof result === "string");
    console.log(result);

    updateBooks();
  };

  return (
    <div>
      <h1>User Profile</h1>
      {error && (
        <pre style={{ color: "red", whiteSpace: "pre-line" }}>{error}</pre>
      )}

      {user ? (
        <>
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

          <h2>All Books</h2>
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul>
            {filteredBooks
              .filter((book) =>
                book.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((book) => (
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
