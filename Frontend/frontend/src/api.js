import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5075/api/", // Adjust API URL
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
        return response.data;
    } catch (error) {
        return error.response?.data || "Login failed";
    }
};
