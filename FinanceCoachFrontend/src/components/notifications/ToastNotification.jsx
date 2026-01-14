// src/components/notifications/ToastNotification.jsx
import { useEffect } from "react";

export function ToastNotification({ open, message, type = "info", onClose }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // auto close after 4 seconds
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  const bgColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 px-6 py-4 rounded shadow-lg max-w-xs text-white ${bgColors[type]}`}
    >
      <div className="flex items-center justify-between">
        <div className="mr-4">{message}</div>
        <button
          onClick={onClose}
          aria-label="Close notification"
          className="font-bold text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}
