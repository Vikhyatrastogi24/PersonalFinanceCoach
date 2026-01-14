import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Button, Card, Modal } from "../../components/ui"; // Assuming Modal is available here
import transactionService from "../../api/transactionService";
import { formatDate } from "../../utils/dateUtils";
import { CiSearch } from "react-icons/ci";

const CATEGORY_COLORS = {
  food: "bg-pink-200",
  rent: "bg-yellow-100",
  bills: "bg-blue-100",
  shopping: "bg-emerald-100",
  income: "bg-green-100",
  other: "bg-gray-100",
};

export default function TransactionList() {
  const navigate = useNavigate();
  const location = useLocation();

  // State and loading for transactions and filters
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // States for edit modal and data being edited
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [editedTxData, setEditedTxData] = useState({
    description: "",
    category: "",
    amount: 0,
    type: "expense",
    date: "",
  });

  // Check if path matches current location to hide nav button
  const isCurrentPage = (path) => location.pathname === path;

  // Navigation helper
  const handleNavigate = (path) => navigate(path);

  // Logout handler from auth context (assume available if needed)
  // const { logout } = useAuth(); // If you want logout here

  // Fetch transactions when search or category changes
  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      try {
        const data = await transactionService.getTransactions({
          category,
          search,
        });
        setTransactions(data);
      } catch {
        alert("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [category, search]);

  // Open modal for editing transaction, prefill with data
  const openEditModal = (tx) => {
    setEditingTx(tx);
    setEditedTxData({
      description: tx.description,
      category: tx.category,
      amount: tx.amount,
      type: tx.type,
      date: tx.date.slice(0, 10), // Format date as 'YYYY-MM-DD'
    });
    setEditModalOpen(true);
  };

  // Handle input changes inside edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTxData((prev) => ({ ...prev, [name]: value }));
  };

  // Save updated transaction via API
  const saveEditedTransaction = async () => {
    if (
      !editedTxData.description.trim() ||
      !editedTxData.category.trim() ||
      !editedTxData.amount ||
      isNaN(editedTxData.amount) ||
      !editedTxData.date
    ) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    try {
      await transactionService.updateTransaction(editingTx.id, {
        ...editedTxData,
        amount: Number(editedTxData.amount),
      });
      setEditModalOpen(false);
      setEditingTx(null);

      // Refresh list after update
      setLoading(true);
      const refreshed = await transactionService.getTransactions({
        category,
        search,
      });
      setTransactions(refreshed);
    } catch {
      alert("Failed to update transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-700 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-base-100 bg-opacity-25 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div
          className="text-3xl font-extrabold text-indigo-900 cursor-pointer select-none"
          onClick={() => handleNavigate("/dashboard")}
        >
          FinanceApp
        </div>
        <div className="flex space-x-4 flex-wrap">
          {!isCurrentPage("/dashboard") && (
            <button
              onClick={() => handleNavigate("/dashboard")}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-lg shadow-indigo-400/50 hover:from-indigo-600 hover:to-purple-500 transition-colors duration-300"
            >
              Home
            </button>
          )}
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
          {/* Assuming you have logout handling from context */}
          {/* Add logout here or in a dedicated navbar component */}
        </div>
      </nav>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto mt-6 px-2 flex-grow">
        <Card className="shadow-xl rounded-xl p-6 bg-base-100">
          <header className="mb-4">
            <h2 className="text-2xl font-bold text-primary">
              Your Transactions
            </h2>
            <p className="text-sm text-muted">
              Quickly review & filter financial activity
            </p>
          </header>

          {/* Filters */}
          <div className="flex gap-4 items-center mb-6 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input input-bordered w-full"
                leadingIcon={<CiSearch className="text-lg" />}
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select select-bordered min-w-[150px]"
            >
              <option value="all">All Categories</option>
              {Object.keys(CATEGORY_COLORS).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <Button
              variant="secondary"
              className="btn btn-accent whitespace-nowrap"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
            >
              Reset
            </Button>
          </div>

          {/* Loading and empty states */}
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-dots loading-lg text-primary"></span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No transactions found. Upload or add transactions now!
            </div>
          ) : (
            <ul className="grid gap-4">
              {transactions.map((tx) => {
                const colorClass =
                  CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.other;
                return (
                  <li key={tx.id}>
                    <Card
                      className={`flex items-center justify-between shadow-md px-4 py-3 rounded-lg hover:scale-105 transition-all duration-150 ${colorClass}`}
                    >
                      <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => openEditModal(tx)}
                        title="Click to edit"
                      >
                        <span className="text-3xl select-none">
                          {tx.category === "food"
                            ? "🍔"
                            : tx.category === "rent"
                            ? "🏠"
                            : tx.category === "income"
                            ? "💸"
                            : "💡"}
                        </span>
                        <div>
                          <div className="font-semibold text-base">
                            {tx.description}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(tx.date)}
                          </div>
                          <span className="badge badge-outline badge-sm mt-1">
                            {tx.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-lg font-bold select-none">
                        <span
                          className={
                            tx.type === "expense"
                              ? "text-red-500"
                              : "text-green-700"
                          }
                        >
                          {tx.type === "expense" ? "- " : "+ "}₹{tx.amount}
                        </span>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Edit Transaction Modal */}
        {editModalOpen && (
          <Modal
            onClose={() => setEditModalOpen(false)}
            title="Edit Transaction"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEditedTransaction();
              }}
              className="flex flex-col gap-4"
            >
              <Input
                label="Description"
                name="description"
                value={editedTxData.description}
                onChange={handleEditChange}
                required
              />
              <select
                name="category"
                value={editedTxData.category}
                onChange={handleEditChange}
                className="select select-bordered"
                required
              >
                {Object.keys(CATEGORY_COLORS).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <Input
                label="Amount (₹)"
                name="amount"
                type="number"
                step="0.01"
                value={editedTxData.amount}
                onChange={handleEditChange}
                required
              />
              <select
                name="type"
                value={editedTxData.type}
                onChange={handleEditChange}
                className="select select-bordered"
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <Input
                label="Date"
                name="date"
                type="date"
                value={editedTxData.date}
                onChange={handleEditChange}
                required
              />
              <div className="flex justify-end gap-4 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setEditModalOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" className="btn-primary">
                  Save
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </section>
    </div>
  );
}
