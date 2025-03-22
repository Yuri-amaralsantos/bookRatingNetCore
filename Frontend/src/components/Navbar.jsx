import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { testAuth } from "../api"; // Import API function

function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      testAuth(token)
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch(() => setUser(null));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setUser(null); // Reset state
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/user">User</Link>
        </li>
        <li>
          <Link to="/books">Books</Link>
        </li>
        {user ? (
          <>
            <li>
              <strong>{user}</strong>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>{" "}
            {/* Logout button */}
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
