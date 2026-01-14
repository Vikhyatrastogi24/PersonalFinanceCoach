import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Input } from "../components/ui";

export default function UserProfile() {
  const { user, token, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    // Add other fields your profile supports here if needed
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Replace this with your actual profile update API call
      // await apiClient.put("/users/profile", profile);
      await new Promise((res) => setTimeout(res, 1000));

      showNotification("Profile updated successfully!", "success");
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to update profile.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const isCurrentPage = (path) => location.pathname === path;

  const handleNavigate = (path) => navigate(path);
  const handleLogout = () => logout();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-900 to-purple-700 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-base-100 bg-opacity-25 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div
          onClick={() => handleNavigate("/dashboard")}
          className="text-3xl font-extrabold text-indigo-900 cursor-pointer select-none"
        >
          FinanceApp
        </div>
        <div className="flex space-x-4">
          {!isCurrentPage("/dashboard") && (
            <button
              onClick={() => handleNavigate("/dashboard")}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-lg shadow-indigo-400/50 hover:from-indigo-600 hover:to-purple-500 transition-colors duration-300"
            >
              Home
            </button>
          )}
          {!isCurrentPage("/chatbot") && (
            <button
              onClick={() => handleNavigate("/chatbot")}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-400/50 hover:from-purple-600 hover:to-indigo-500 transition-colors duration-300"
            >
              Chatbot
            </button>
          )}
          {!isCurrentPage("/budgets") && (
            <button
              onClick={() => handleNavigate("/budgets")}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg shadow-green-400/50 hover:from-emerald-600 hover:to-green-500 transition-colors duration-300"
            >
              Budgets
            </button>
          )}
          {!isCurrentPage("/upload-transactions") && (
            <button
              onClick={() => handleNavigate("/upload-transactions")}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold shadow-lg shadow-yellow-400/50 hover:from-yellow-500 hover:to-yellow-400 transition-colors duration-300"
            >
              Upload Transactions
            </button>
          )}
          {!isCurrentPage("/profile") && (
            <button
              onClick={() => handleNavigate("/profile")}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold shadow-lg shadow-blue-400/50 hover:from-cyan-600 hover:to-blue-500 transition-colors duration-300"
            >
              Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-lg shadow-red-500/60 hover:from-red-700 hover:to-red-600 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-xl mx-auto flex-grow w-full px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 drop-shadow-lg">
          User Profile
        </h1>
        <Card className="p-8 bg-base-100 rounded-xl shadow-xl">
          <div className="flex flex-col gap-6">
            <Input
              label="Full Name"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled
              className="rounded-md border-gray-300 bg-gray-100 cursor-not-allowed"
            />
            {/* Add other fields as needed */}
            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-colors duration-300"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="ghost"
                color="error"
                onClick={handleLogout}
                className="py-2 px-6 rounded-lg"
              >
                Logout
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
