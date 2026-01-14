// src/features/authentication/AuthPage.jsx
import React, { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import SignUpForm from "../../components/auth/SignUpForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-900 via-indigo-900 to-blue-900 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8">
        {isLogin ? <LoginForm /> : <SignUpForm />}

        <div className="mt-6 text-center text-gray-700">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={toggleForm}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={toggleForm}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Log in here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
