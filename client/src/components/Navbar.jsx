"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { Menu, X, User, LogOut, ShoppingCart, Package, Home, Users, Truck } from "lucide-react"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
    setIsMenuOpen(false)
  }

  const switchUserType = () => {
    const targetType = user.userType === "vendor" ? "supplier" : "vendor"
    navigate(`/${targetType}/dashboard`)
    setIsMenuOpen(false)
  }

  const getNavItems = () => {
    if (!user) return []

    if (user.userType === "vendor") {
      return [
        { path: "/vendor/dashboard", label: "Dashboard", icon: Home },
        { path: "/vendor/products", label: "Products", icon: Package },
        { path: "/vendor/orders", label: "My Orders", icon: ShoppingCart },
      ]
    } else {
      return [
        { path: "/supplier/dashboard", label: "Dashboard", icon: Home },
        { path: "/supplier/products", label: "My Products", icon: Package },
        { path: "/supplier/orders", label: "Orders", icon: Truck },
      ]
    }
  }

  const navItems = getNavItems()

  if (!user) {
    return null
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Freshly Yours</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User size={18} />
              <span className="font-medium">{user.name}</span>
              <span className="text-sm text-gray-500 capitalize">({user.userType})</span>
            </div>

            <button onClick={switchUserType} className="btn-outline text-sm">
              Switch to {user.userType === "vendor" ? "Supplier" : "Vendor"}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2 text-gray-700">
                  <User size={20} />
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{user.userType}</div>
                  </div>
                </div>

                <button
                  onClick={switchUserType}
                  className="w-full text-left flex items-center space-x-3 px-3 py-3 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                >
                  <Users size={20} />
                  <span>Switch to {user.userType === "vendor" ? "Supplier" : "Vendor"}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
