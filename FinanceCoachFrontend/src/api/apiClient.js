// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // Adjust base URL as needed for your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request interceptor to automatically add auth token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or use a better state manager if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle specific status codes here (e.g., logout on 401)
    return Promise.reject(error);
  }
);

export default apiClient;
