// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import authService from "../api/authService";

// Create AuthContext
const AuthContext = createContext(null);

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
export { AuthContext };

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser || savedUser === "undefined") {
      return null;
    }
    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper for setting auth state and saving to localStorage
  const setAuthData = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    if (userData === undefined || userData === null) {
      localStorage.removeItem("user");
    } else {
      localStorage.setItem("user", JSON.stringify(userData));
    }

    if (jwtToken === undefined || jwtToken === null) {
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", jwtToken);
    }
  };

  // Login method
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      console.log("Login response data:", data);

      // Construct user object manually from backend response
      const userObj = {
        id: data.userId,
        email: data.email,
        fullName: data.fullName,
      };

      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;
      setAuthData(userObj, data.token);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  // Signup method (optional: adjust similarly if backend returns flat user data)
  const signup = async (signupData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.signup(signupData);
      const userObj = {
        id: data.userId,
        email: data.email,
        fullName: data.fullName,
      };
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;
      setAuthData(userObj, data.token);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || "Signup failed");
    }
  };

  // Logout method
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  // On mount, set axios header if token exists
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
