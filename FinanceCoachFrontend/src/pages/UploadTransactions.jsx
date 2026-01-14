import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useNotification from "../hooks/useNotifications";
import transactionService from "../api/transactionService";
import { Card, Button, Input } from "../components/ui";

export default function UploadTransactions() {
  const { token, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper to check if path is current page
  const isCurrentPage = (path) => location.pathname === path;

  const handleNavigate = (path) => navigate(path);

  const handleLogout = () => logout();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      showNotification("Please select a CSV file to upload.", "error");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await transactionService.uploadTransactions(formData);
      showNotification("Transactions uploaded successfully!", "success");
      setFile(null); // Clear the file input
    } catch (err) {
      showNotification(
        err.message || "Failed to upload transactions.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

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
      <main className="flex-grow max-w-xl mx-auto w-full p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-white drop-shadow-lg">
          Upload Transactions
        </h1>

        <Card className="p-8 bg-base-100 rounded-xl shadow-xl">
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label
                htmlFor="transaction-file"
                className="block mb-2 font-semibold text-gray-700"
              >
                Select your transaction CSV file
              </label>
              <Input
                id="transaction-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={loading}
                className="w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transition-colors duration-300"
            >
              {loading ? "Uploading..." : "Upload CSV"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-gray-500">
            Supported format: <span className="font-medium">.csv</span> only.
          </p>
        </Card>
      </main>
    </div>
  );
}
