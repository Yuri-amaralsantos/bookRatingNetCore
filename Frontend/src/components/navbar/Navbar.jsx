import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { testAuth } from "../../api"; // Import API function
import "./NavBar.css"; // Import CSS file

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
    <nav className="navbar">
      <div className="site-title">
        <strong>BookRatings</strong>
      </div>
      <div className="menu">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/books">Books</Link>
          </li>
          {user ? (
            <>
              <li className="user-info">
                <Link to="/user">{user}</Link> {/* User link to profile */}
              </li>
              <li>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
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
      </div>
    </nav>
  );
}

export default NavBar;
