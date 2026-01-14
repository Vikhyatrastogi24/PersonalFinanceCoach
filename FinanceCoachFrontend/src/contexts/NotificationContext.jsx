// src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { ToastNotification } from "../components/notifications/ToastNotification";

const NotificationContext = createContext();
export { NotificationContext };

export function NotificationProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info",
  });

  // Show a toast notification with message and type
  const showNotification = useCallback((message, type = "info") => {
    setToast({ open: true, message, type });
  }, []);

  // Close/hide toast notification
  const closeNotification = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <ToastNotification
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={closeNotification}
      />
    </NotificationContext.Provider>
  );
}

// Custom hook for easy access to notification context
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
