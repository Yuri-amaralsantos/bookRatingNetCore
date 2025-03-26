import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { testAuth } from "../api";
import "./Home.css";

function Home() {
  const [authMessage, setAuthMessage] = useState("");
  const [books, setBooks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setAuthMessage("You are not logged in.");
      return;
    }

    testAuth(storedToken)
      .then((data) => setAuthMessage(data.message))
      .catch(() => setAuthMessage("Authentication failed"));

    axios
      .get("http://localhost:5075/api/books", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        // Get last three books
        const lastThreeBooks = response.data.slice(-3).reverse();
        setBooks(lastThreeBooks);
      })
      .catch(() => setBooks([]));
  }, []);

  return (
    <div>
      <h1 className="home-title">Home</h1>

      <h2 className="latest-books">Latest Books</h2>
      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="book-card">
              <img src="image.jpg" alt={book.title} className="book-image" />
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <Link to={`/book/${book.id}`} className="book-link">
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p>No recent books found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
