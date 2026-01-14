// src/api/authService.js
import apiClient from "./apiClient";

const authService = {
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data; // usually { user, token }
  },

  signup: async (signupData) => {
    const response = await apiClient.post("/auth/signup", signupData);
    return response.data; // usually { user, token }
  },

  logout: async () => {
    // Optional: Call backend logout to invalidate tokens if supported
    // For JWT stateless tokens, this may be empty or delete token locally only
    return Promise.resolve();
  },

  refreshToken: async () => {
    // Implement refresh token logic if your backend supports it
    // Example:
    // const response = await apiClient.post("/auth/refresh-token");
    // return response.data;
  },
};

export default authService;
