"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { SocketProvider } from "./context/SocketContext"

// Auth Components
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

// Vendor Components
import VendorDashboard from "./pages/vendor/Dashboard"
import VendorProducts from "./pages/vendor/Products"
import VendorOrder from "./pages/vendor/Order"
import VendorOrders from "./pages/vendor/Orders"

// Supplier Components
import SupplierDashboard from "./pages/supplier/Dashboard"
import SupplierProducts from "./pages/supplier/Products"
import SupplierOrders from "./pages/supplier/Orders"

// Shared Components
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import LoadingSpinner from "./components/LoadingSpinner"

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.userType}/dashboard`} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.userType}/dashboard`} />} />

        {/* Vendor Routes */}
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute userType="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/products"
          element={
            <ProtectedRoute userType="vendor">
              <VendorProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/order/:productId"
          element={
            <ProtectedRoute userType="vendor">
              <VendorOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/orders"
          element={
            <ProtectedRoute userType="vendor">
              <VendorOrders />
            </ProtectedRoute>
          }
        />

        {/* Supplier Routes */}
        <Route
          path="/supplier/dashboard"
          element={
            <ProtectedRoute userType="supplier">
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/products"
          element={
            <ProtectedRoute userType="supplier">
              <SupplierProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/orders"
          element={
            <ProtectedRoute userType="supplier">
              <SupplierOrders />
            </ProtectedRoute>
          }
        />

        {/* Default Routes */}
        <Route path="/" element={user ? <Navigate to={`/${user.userType}/dashboard`} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
