import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookById } from "../api"; // Import API function

function BookPage() {
  const { bookId } = useParams(); // Get book ID from URL
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token"); // Retrieve token for authentication

  useEffect(() => {
    if (bookId) {
      getBookById(token, bookId)
        .then((data) => setBook(data))
        .catch(() => setError("Failed to fetch book details."));
    }
  }, [bookId, token]);

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
      <Link to="/books">Back to Books</Link>
    </div>
  );
}

export default BookPage;
