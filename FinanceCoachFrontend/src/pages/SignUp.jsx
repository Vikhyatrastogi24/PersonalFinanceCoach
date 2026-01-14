// src/pages/SignUp.jsx
import React from "react";
import SignUpForm from "../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <title>Sign Up - Personal Finance Coach</title>

      {/* Page wrapper */}
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <SignUpForm />
      </div>
    </>
  );
}
