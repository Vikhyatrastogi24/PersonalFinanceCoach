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

export default function SignUpForm() {
  const { signup, loading, error } = useAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await signup(formData);
      showNotification("Signup successful! Redirecting...", "success");
    } catch (err) {
      showNotification(
        err?.message || "Signup failed. Please try again.",
        "error"
      );
      setLocalError(err?.message);
    }
  };

  // Optional: Show notification if error from context changes
  useEffect(() => {
    if (error) {
      showNotification(error, "error");
      setLocalError(error);
    }
  }, [error, showNotification]);

  return (
    <div className="!bg-gradient-to-tr !from-indigo-900 !via-purple-900 !to-pink-900 min-h-[100dvh] w-full flex flex-col items-center justify-center p-0">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <Card className="w-full max-w-md mx-auto shadow-2xl rounded-3xl bg-gradient-to-br from-pink-700 to-purple-700 border border-pink-600 backdrop-blur-md px-4 sm:px-8 py-6">
          <CardHeader className="text-center space-y-3 pt-6 pb-2">
            <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-xl">
              Create Your Account
            </CardTitle>
            <p className="text-pink-200 font-medium text-base md:text-lg">
              Start your journey to financial freedom today
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
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-pink-200 mb-1"
                >
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-pink-500 bg-purple-900/40 placeholder-pink-300 text-white focus:ring-2 focus:ring-pink-400"
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-pink-200 mb-1"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-pink-500 bg-purple-900/40 placeholder-pink-300 text-white focus:ring-2 focus:ring-pink-400"
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-pink-200 mb-1"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-pink-500 bg-purple-900/40 placeholder-pink-300 text-white focus:ring-2 focus:ring-pink-400"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-700 hover:from-pink-500 hover:via-purple-600 hover:to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg"
              >
                {loading ? "Loading..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center text-sm text-pink-300 mt-6 mb-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold hover:underline text-pink-100"
            >
              Log in here
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
