import React from "react";
import useAuth from "@/hooks/useAuth"; // default import from your hook file
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { user, token } = useAuth();

  console.log("PrivateRoute auth check:", { user, token });

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
