import { useEffect, useState } from "react";
import {
  getUserBooks,
  testAuth,
  fetchBooks, // Corrected import
  addBookToUser,
  removeBookFromUser,
} from "../api";

function User() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]); // User's books
  const [filteredBooks, setFilteredBooks] = useState([]); // Filtered books based on search
  const [search, setSearch] = useState(""); // Search bar input
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      return;
    }

    // Fetch authenticated user info
    testAuth(token)
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          setError((prev) => prev + "\nAuthentication failed.");
        }
      })
      .catch(() =>
        setError((prev) => prev + "\nAuthentication request failed.")
      );

    // Fetch user's books
    getUserBooks(token)
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          setError((prev) => prev + "\nFailed to fetch user's books.");
        }
      })
      .catch(() => setError((prev) => prev + "\nError fetching user books."));

    // Fetch all books and filter them later
    fetchBooks(token)
      .then((data) => {
        if (Array.isArray(data)) {
          setFilteredBooks(data);
        } else {
          setError((prev) => prev + "\nFailed to fetch available books.");
        }
      })
      .catch(() =>
        setError((prev) => prev + "\nError fetching available books.")
      );
  }, []);

  // Filter books based on search
  useEffect(() => {
    if (search.trim() === "") {
      fetchBooks(localStorage.getItem("token")).then(setFilteredBooks);
    } else {
      setFilteredBooks((prevBooks) =>
        prevBooks.filter((book) =>
          book.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search]);

  const handleAddBook = (bookId) => {
    const token = localStorage.getItem("token");
    addBookToUser(token, bookId)
      .then(() => getUserBooks(token))
      .then((updatedBooks) => {
        setBooks(updatedBooks);
        return fetchBooks(token); // Fetch updated available books
      })
      .then(setFilteredBooks)
      .catch(() => setError((prev) => prev + "\nFailed to add book."));
  };

  const handleRemoveBook = (bookId) => {
    const token = localStorage.getItem("token");
    removeBookFromUser(token, bookId)
      .then(() => getUserBooks(token))
      .then((updatedBooks) => {
        setBooks(updatedBooks);
        return fetchBooks(token); // Fetch updated available books
      })
      .then(setFilteredBooks)
      .catch(() => setError((prev) => prev + "\nFailed to remove book."));
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

          {/* Search Bar for Filtering Books */}
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <h2>Your Books</h2>
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                {book.title} by {book.author}{" "}
                <button onClick={() => handleRemoveBook(book.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <h2>Filtered Books</h2>
          <ul>
            {filteredBooks.map((book) => (
              <li key={book.id}>
                {book.title} by {book.author}{" "}
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
