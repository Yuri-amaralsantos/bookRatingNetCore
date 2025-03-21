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
        if (response.data.token) {
            localStorage.setItem("token", response.data.token); // Save token
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
