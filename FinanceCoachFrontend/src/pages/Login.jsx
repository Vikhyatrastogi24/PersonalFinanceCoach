// src/pages/Login.jsx
import React from "react";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <>
      {/* Optional: set page title */}
      <title>Login - Personal Finance Coach</title>

      {/* Page wrapper */}
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <LoginForm />
      </div>
    </>
  );
}
