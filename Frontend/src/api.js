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
        const [allBooksResponse, userBooksResponse] = await Promise.all([
            api.get("books", { headers: { Authorization: `Bearer ${token}` } }),
            api.get("user/books", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const allBooks = allBooksResponse.data;
        const userBooks = userBooksResponse.data;

        // Filter books that are not in the user's list
        const availableBooks = allBooks.filter(book =>
            !userBooks.some(userBook => userBook.id === book.id)
        );

        return availableBooks;
    } catch (error) {
        return error.response?.data || "Failed to fetch available books";
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

export const getAllBooks = async (token) => {
    try {
        const response = await api.get("books", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || "Failed to fetch all books";
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
