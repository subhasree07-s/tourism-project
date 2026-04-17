import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// ── Public Pages ─────────────────────────
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForbiddenPage from "../pages/ForbiddenPage";

// ── User Pages ─────────────────────────
import DashboardPage from "../pages/user/DashboardPage";
import DestinationsPage from "../pages/user/DestinationsPage";
import PackagesPage from "../pages/user/PackagesPage";
import PackageDetailsPage from "../pages/user/PackageDetailsPage";
import PaymentPage from "../pages/user/PaymentPage";
import ReceiptPage from "../pages/user/ReceiptPage"; // ✅ FIXED PATH

// ── Admin Pages ─────────────────────────
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsersPage from "../pages/admin/ManageUsersPage";
import ManagePackagesPage from "../pages/admin/ManagePackagesPage";
import ManageBookingsPage from "../pages/admin/ManageBookingsPage";
import ManageDestinationsPage from "../pages/admin/ManageDestinationsPage";
import AdminReviews from "../pages/admin/AdminReviews";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public Routes ───────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* ── Protected USER Routes ───────── */}
        <Route element={<ProtectedRoute />}>

          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/packages" element={<PackagesPage />} />

          {/* Package Details */}
          <Route path="/package/:id" element={<PackageDetailsPage />} />

          {/* Payment */}
          <Route path="/payment" element={<PaymentPage />} />

          {/* ✅ RECEIPT PAGE */}
          <Route path="/receipt" element={<ReceiptPage />} />

        </Route>

        {/* ── Admin Routes ───────────────── */}
        <Route element={<ProtectedRoute requireAdmin />}>

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsersPage />} />
          <Route path="/admin/packages" element={<ManagePackagesPage />} />
          <Route path="/admin/bookings" element={<ManageBookingsPage />} />
          <Route path="/admin/destinations" element={<ManageDestinationsPage />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />

        </Route>

        {/* ── Catch All ───────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;