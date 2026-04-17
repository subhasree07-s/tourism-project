import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * ──────────────
 * Props:
 *   requireAdmin  – if true, also requires role === 'admin'
 *   redirectTo    – where to redirect on failure (default: /login)
 */

const ProtectedRoute = ({
  requireAdmin = false,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // 🔐 Not logged in → redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // 🚫 Not admin but admin required
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
};

export default ProtectedRoute;