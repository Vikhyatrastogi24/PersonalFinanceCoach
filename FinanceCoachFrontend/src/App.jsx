import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute"; // Adjust path if needed
import { NotificationProvider } from "./contexts/NotificationContext";

// Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import BudgetPage from "./features/budgets/BudgetPage";
import Chatbot from "./pages/Chatbot";
import UploadTransactions from "./pages/UploadTransactions";
import UserProfile from "./pages/UserProfile";
import TransactionList from "./features/transactions/TransactionList"; // Added import

export default function App() {
  return (
    <NotificationProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes (wrapped by PrivateRoute) */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budgets" element={<BudgetPage />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/upload-transactions" element={<UploadTransactions />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/transactions" element={<TransactionList />} />{" "}
          {/* Added route */}
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>
  );
}
