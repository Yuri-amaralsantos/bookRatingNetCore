import { useEffect, useState } from "react";
import { testAuth } from "../api"; // Import testAuth function

function Home() {
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from local storage
    if (!token) {
      setAuthMessage("You are not logged in.");
      return;
    }

    testAuth(token)
      .then((data) => setAuthMessage(data.message))
      .catch(() => setAuthMessage("Authentication failed"));
  }, []);

  return (
    <div>
      <p></p>
    </div>
  );
}

export default Home;
