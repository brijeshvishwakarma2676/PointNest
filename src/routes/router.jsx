import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import Dashboard from "../pages/Dashboard";
import CustomersPage from "../features/customers/pages/CustomersPage";
import AddPurchase from "../features/purchases/pages/AddPurchase";
import PointsLookup from "../pages/PointsLookup";
import Layout from "../components/layout/Layout";
import NotFound from "../pages/NotFound";
import RedeemPoints from "../features/redemptions/pages/RedeemPoints";
import PointsHistory from "../features/customers/pages/PointsHistory";

// A wrapper component that checks for authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If they aren't authenticated, boot them back to the login page immediately
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the requested page inside the Layout shell
  return <Layout>{children}</Layout>;
};

// A wrapper component that prevents logged-in users from seeing the login/register pages
const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (only visible if logged OUT) */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        {/* Protected routes (only visible if logged IN) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase"
          element={
            <ProtectedRoute>
              <AddPurchase />
            </ProtectedRoute>
          }
        />
        <Route
          path="/points"
          element={
            <ProtectedRoute>
              <PointsLookup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/redeem"
          element={
            <ProtectedRoute>
              <RedeemPoints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <PointsHistory />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
