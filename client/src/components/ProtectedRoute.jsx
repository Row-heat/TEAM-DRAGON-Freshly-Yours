"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "./LoadingSpinner"

const ProtectedRoute = ({ children, userType }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (userType && user.userType !== userType) {
    return <Navigate to={`/${user.userType}/dashboard`} />
  }

  return children
}

export default ProtectedRoute
