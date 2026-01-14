// src/components/chatbot/ChatMessage.jsx
import React from "react";

export default function ChatMessage({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      aria-live="polite"
    >
      <div
        className={`max-w-[70%] px-4 py-3 rounded-lg shadow ${
          isUser ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
