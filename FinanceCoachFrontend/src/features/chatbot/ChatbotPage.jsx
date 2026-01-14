import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotifications";
import chatbotService from "../../api/chatbotService";
import ChatInput from "../../components/chatbot/ChatInput";
import ChatMessage from "../../components/chatbot/ChatMessage";
import { Card } from "../../components/ui/card";

export default function ChatbotPage() {
  const { token, logout, user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState([
    {
      id: 0,
      sender: "bot",
      text: "Hi! How can I assist you with your finances today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNavigate = (path) => navigate(path);

  const handleLogout = () => logout();

  const isCurrentPage = (path) => location.pathname === path;

  const handleSend = async (messageText) => {
    if (!messageText.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length, sender: "user", text: messageText },
    ]);
    setLoading(true);

    try {
      const response = await chatbotService.sendMessage(messageText, token);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          sender: "bot",
          text:
            response.message || response.data?.reply || "Sorry, no response",
        },
      ]);
    } catch (error) {
      showNotification("Error sending message", "error");
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

      {/* Chat content */}
      <main className="flex flex-col flex-grow max-w-3xl mx-auto w-full p-6 md:p-10">
        <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">
          Personal Finance Chatbot
        </h1>

        <Card className="flex flex-col flex-grow overflow-hidden shadow-xl rounded-xl bg-base-100 text-black">
          <div className="flex flex-col flex-grow overflow-y-auto p-4 space-y-4 max-h-[60vh] md:max-h-[70vh]">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} />
            ))}
            <div ref={messageEndRef} />
          </div>
          <ChatInput onSend={handleSend} loading={loading} />
        </Card>
      </main>
    </div>
  );
}
