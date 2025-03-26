import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5075/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setBooks(response.data))
      .catch(() => setBooks([]));
  }, []);

  return (
    <div className="books-container">
      <h1 className="books-title">Books Page</h1>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img src="image.jpg" alt={book.title} className="book-image" />
            <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <Link to={`/book/${book.id}`} className="book-link">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;
