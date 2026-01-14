import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useNotification from "../hooks/useNotifications";
import analyticsService from "../api/analyticsService";
import SummaryCard from "@/components/dashboard/SummaryCard";
import StatsWidget from "@/components/dashboard/StatsWidget";
import Chart from "@/features/analytics/Chart";
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError(null);
      try {
        const data = await analyticsService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message || "Unknown error");
        showNotification(
          err.message || "Failed to fetch dashboard data.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [showNotification]);

  // Checks if the given path matches the current location path
  const isCurrentPage = (path) => location.pathname === path;

  const handleNavigate = (path) => navigate(path);

  const handleLogout = () => logout();

  const spendingByCategoryData = dashboardData?.spendingByCategory || [];
  const budgetVsActualData = dashboardData?.budgetVsActual || [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 to-purple-700 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-base-100 bg-opacity-25 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div
          className="text-3xl font-extrabold cursor-pointer text-indigo-900 select-none"
          onClick={() => handleNavigate("/dashboard")}
        >
          FinanceApp
        </div>
        <div className="flex space-x-4">
          {!isCurrentPage("/transactions") && (
            <button
              onClick={() => handleNavigate("/transactions")}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold shadow-lg shadow-pink-400/50 hover:from-rose-600 hover:to-pink-500 transition-colors duration-300"
            >
              Transactions
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
      <main className="flex-grow p-6 md:p-10">
        {/* Welcome */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 drop-shadow-lg">
          Welcome back,{" "}
          <span className="text-indigo-300">{user?.fullName || "User"}</span>!
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <SummaryCard
            title="Current Balance"
            value={`$${dashboardData?.currentBalance?.toFixed(2) || "0.00"}`}
            icon={<CurrencyDollarIcon className="h-10 w-10 text-green-300" />}
            color="bg-green-700"
          />
          <SummaryCard
            title="Monthly Budget"
            value={`$${dashboardData?.monthlyBudget?.toFixed(2) || "0.00"}`}
            icon={<ChartBarIcon className="h-10 w-10 text-yellow-300" />}
            color="bg-yellow-600"
          />
          <SummaryCard
            title="Transactions This Month"
            value={dashboardData?.monthlyTransactionsCount || 0}
            icon={
              <ClipboardDocumentListIcon className="h-10 w-10 text-blue-300" />
            }
            color="bg-blue-700"
          />
        </div>

        {/* Stats Widget - Monthly Spending Bar Chart */}
        <StatsWidget
          title="Monthly Spending"
          data={
            dashboardData?.monthlySpending || [
              { month: "Jan", spending: 600 },
              { month: "Feb", spending: 450 },
              { month: "Mar", spending: 700 },
              { month: "Apr", spending: 500 },
              { month: "May", spending: 750 },
              { month: "Jun", spending: 680 },
            ]
          }
        />

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <Chart
            type="pie"
            title="Spending by Category"
            data={spendingByCategoryData}
            dataKey="amount"
            nameKey="category"
          />
          <Chart
            type="bar"
            title="Budget vs Actual"
            data={budgetVsActualData}
            dataKey="Spent"
            nameKey="category"
          />
        </div>
      </main>
    </div>
  );
}
