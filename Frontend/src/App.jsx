import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import User from "./pages/User";
import Books from "./pages/Books";
import NavBar from "./components/navbar/Navbar"; // Import NavBar
import BookPage from "./pages/BookPage";

function App() {
  return (
    <Router>
      <NavBar /> {/* Add NavBar here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/books" element={<Books />} />
        <Route path="/book/:bookId" element={<BookPage />} />
      </Routes>
    </Router>
  );
}

export default App;
