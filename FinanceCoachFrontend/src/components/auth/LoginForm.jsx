import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotifications";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const { login, loading, error, user } = useAuth();
  const { showNotification } = useNotification();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      console.log("Attempting login with credentials:", credentials);
      await login(credentials);
      console.log("Login function resolved successfully");
      showNotification("Login successful!", "success");
    } catch (err) {
      console.error("Login failed:", err);
      showNotification(
        err?.message || "Login failed. Please try again.",
        "error"
      );
      setLocalError(err?.message);
    }
  };

  // Optional: Show notification if error state from auth context changes
  useEffect(() => {
    if (error) {
      showNotification(error, "error");
      setLocalError(error);
    }
  }, [error, showNotification]);

  return (
    // Fullscreen gradient bg, safe-area padding for mobile
    <div className="!bg-gradient-to-tr !from-purple-900 !via-indigo-900 !to-blue-900 min-h-[100dvh] w-full flex flex-col items-center justify-center p-0">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <Card className="w-full max-w-md mx-auto shadow-2xl rounded-3xl bg-gradient-to-br from-indigo-800 to-purple-700 border border-purple-600 backdrop-blur-md px-4 sm:px-8 py-6">
          <CardHeader className="text-center space-y-3 pt-6 pb-2">
            <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-xl">
              Welcome Back
            </CardTitle>
            <p className="text-purple-200 font-medium text-base md:text-lg">
              Log in to access your personal finance dashboard
            </p>
          </CardHeader>

          <CardContent>
            {localError && (
              <div className="flex items-center space-x-3 p-3 rounded-lg text-red-100 bg-red-700/90 mb-5 shadow-lg ring-1 ring-red-800/70">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-semibold text-red-100">{localError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-purple-200 mb-1"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-purple-500 bg-indigo-900/40 placeholder-purple-300 text-white focus:ring-2 focus:ring-purple-400"
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-purple-200 mb-1"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-purple-500 bg-indigo-900/40 placeholder-purple-300 text-white focus:ring-2 focus:ring-purple-400"
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-700 to-blue-600 hover:from-purple-500 hover:via-indigo-600 hover:to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg"
              >
                {loading ? "Loading..." : "Log In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center text-sm text-purple-300 mt-6 mb-2">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold hover:underline text-purple-100"
            >
              Sign up here
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
