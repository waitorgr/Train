import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}