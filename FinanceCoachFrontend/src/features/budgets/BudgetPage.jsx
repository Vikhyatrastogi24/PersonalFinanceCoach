import React, { useEffect, useState, useContext } from "react";
import budgetService from "../../api/budgetService";
import { Card, Button, Input, Progress } from "../../components/ui";
import { useNotification } from "../../contexts/NotificationContext";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

function BudgetForm({ onSave, onCancel, initialData = {} }) {
  const [category, setCategory] = useState(initialData.category || "");
  const [targetAmount, setTargetAmount] = useState(initialData.target_amount || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category.trim()) {
      setError("Category is required");
      return;
    }
    if (!targetAmount || isNaN(targetAmount) || targetAmount <= 0) {
      setError("Enter a valid target amount");
      return;
    }
    setError("");
    onSave({
      category: category.trim(),
      target_amount: Number(targetAmount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <Input
        placeholder="Target Amount (₹)"
        type="number"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        className="rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Save
        </Button>
      </div>
    </form>
  );
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [editing, setEditing] = useState(null); // budget id being edited
  const [adding, setAdding] = useState(false);
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  // Helper to check if given path is current page, to hide that nav button
  const isCurrentPage = (path) => location.pathname === path;

  const handleNavigate = (path) => navigate(path);

  const handleLogout = () => logout();

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const data = await budgetService.getBudgets();
      setBudgets(data);
    } catch {
      showNotification("Failed to load budgets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleAdd = async (budget) => {
    try {
      await budgetService.createBudget(budget);
      showNotification("Budget added", "success");
      setAdding(false);
      loadBudgets();
    } catch {
      showNotification("Failed to add budget", "error");
    }
  };

  const handleUpdate = async (budget) => {
    try {
      await budgetService.updateBudget(editing, budget);
      showNotification("Budget updated", "success");
      setEditing(null);
      loadBudgets();
    } catch {
      showNotification("Failed to update budget", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    try {
      await budgetService.deleteBudget(id);
      showNotification("Budget deleted", "success");
      loadBudgets();
    } catch {
      showNotification("Failed to delete budget", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 to-purple-700 text-white">
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
      <main className="flex-grow max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-primary">Budgets</h1>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg shadow-lg"
            onClick={() => setAdding(true)}
          >
            + Add Budget
          </Button>
        </div>

        {adding && (
          <Card className="mb-8 p-6 bg-base-100 shadow-xl rounded-xl">
            <BudgetForm onSave={handleAdd} onCancel={() => setAdding(false)} />
          </Card>
        )}

        {loading ? (
          <p className="text-center text-gray-300">Loading budgets...</p>
        ) : budgets.length === 0 ? (
          <p className="text-center text-gray-400">No budgets set yet.</p>
        ) : (
          <div className="grid gap-6">
            {budgets.map((budget) => {
              // Adjust to use target_amount if needed
              const spent = Math.min(budget.spent || 0, budget.target_amount || 0);
              const percent = budget.target_amount
                ? Math.round((spent / budget.target_amount) * 100)
                : 0;
              return (
                <Card
                  key={budget.id}
                  className="flex flex-col md:flex-row justify-between items-center p-6 bg-base-100 shadow-md rounded-lg"
                >
                  <div className="flex-1">
                    {editing === budget.id ? (
                      <BudgetForm
                        initialData={budget}
                        onSave={handleUpdate}
                        onCancel={() => setEditing(null)}
                      />
                    ) : (
                      <>
                        <h2 className="text-2xl font-semibold">
                          {budget.category}
                        </h2>
                        <p className="text-sm text-muted">
                          Target amount: ₹
                          {budget.target_amount
                            ? budget.target_amount.toLocaleString()
                            : "—"}
                        </p>
                        <Progress
                          value={percent}
                          max={100}
                          className={`progress w-full mt-2 ${
                            percent > 90 ? "progress-error" : "progress-primary"
                          }`}
                        >
                          {percent}% Spent
                        </Progress>
                      </>
                    )}
                  </div>

                  {editing !== budget.id && (
                    <div className="flex gap-4 mt-4 md:mt-0">
                      <Button
                        variant="ghost"
                        onClick={() => setEditing(budget.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        color="error"
                        onClick={() => handleDelete(budget.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
