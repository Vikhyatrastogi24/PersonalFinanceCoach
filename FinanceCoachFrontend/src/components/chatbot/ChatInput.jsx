// src/components/chatbot/ChatInput.jsx
import React, { useState } from "react";
import { Input } from "../ui/input";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading || !text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border-t border-gray-300 p-3 bg-gray-100 rounded-b-xl"
    >
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask me anything..."
        disabled={loading}
        className="flex-grow bg-white"
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="p-2 ml-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        aria-label="Send message"
      >
        <PaperAirplaneIcon className="w-5 h-5 rotate-90" />
      </button>
    </form>
  );
}
