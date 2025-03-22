import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5075/api/",
    headers: { "Content-Type": "application/json" },
});

export const registerUser = async (username, password) => {
    try {
        const response = await api.post("auth/register", { username, password });
        return response.data;
    } catch (error) {
        return error.response?.data || "Registration failed";
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await api.post("auth/login", { username, password });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (error) {
        return error.response?.data || "Login failed";
    }
};

export const testAuth = async (token) => {
    try {
        const response = await api.get("auth/test-auth", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || "Authentication test failed";
    }
};

export const fetchBooks = async (token) => {
    try {
        const response = await api.get("books", { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error.response?.data || "Failed to fetch books";
    }
};


export const getUserBooks = async (token) => {
    try {
        const response = await api.get("user/books", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || "Failed to fetch user books";
    }
};



export const addBookToUser = async (token, bookId) => {
    try {
        const response = await api.post(`user/books/${bookId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || "Failed to add book to user";
    }
};

export const removeBookFromUser = async (token, bookId) => {
    try {
        const response = await api.delete(`user/books/${bookId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || "Failed to remove book from user";
    }
};

export const getBookById = async (token, bookId) => {
    try {
        const response = await api.get(`books/${bookId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || "Failed to fetch book details";
    }
};

export const getUserReviews = async (token) => {
    try {
        const response = await api.get("reviews/user", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return Array.isArray(response.data) ? response.data : []; // Ensure we return an array
    } catch (error) {
        return []; // If any error occurs, return an empty array
    }
};




export const getReviewsForBook = async (token, bookId) => {
    try {
        const response = await api.get(`reviews/book/${bookId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || "Failed to fetch book reviews";
    }
};

export const addReview = async (token, reviewData) => {
    try {
        const response = await api.post("reviews/add", reviewData, {  // Ensure correct endpoint
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding review:", error.response?.data); // Log backend error
        return error.response?.data || "Failed to add review";
    }
};


export const removeReview = async (token, reviewId) => {
    try {
        const response = await api.delete(`reviews/remove/${reviewId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || "Failed to remove review";
    }
};