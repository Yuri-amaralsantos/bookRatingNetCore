import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
    <div>
      <h1>Books Page</h1>
      {books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <Link to={`/book/${book.id}`}>{book.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books found or failed to fetch.</p>
      )}
    </div>
  );
}

export default Books;
