"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { useSocket } from "../../context/SocketContext"
import { Package, ShoppingCart, Clock, TrendingUp, Plus, Eye, Users } from "lucide-react"

const Dashboard = () => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("new-order", (data) => {
        // Update stats and recent orders when new order comes
        setStats((prev) => ({
          ...prev,
          totalOrders: prev.totalOrders + 1,
          pendingOrders: prev.pendingOrders + 1,
        }))

        // Add new order to recent orders
        setRecentOrders((prev) => [data.order, ...prev.slice(0, 4)])
      })

      return () => {
        socket.off("new-order")
      }
    }
  }, [socket])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch products and orders in parallel
      const [productsResponse, ordersResponse] = await Promise.all([
        axios.get("/supplier/products"),
        axios.get("/orders/supplier"),
      ])

      const products = productsResponse.data.products || []
      const orders = ordersResponse.data.orders || []

      // Calculate stats
      const pendingOrders = orders.filter((order) => order.status === "placed").length
      const totalRevenue = orders
        .filter((order) => order.status === "delivered")
        .reduce((sum, order) => sum + order.totalAmount, 0)

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders,
        totalRevenue,
      })

      // Set recent orders (last 5)
      setRecentOrders(orders.slice(0, 5))
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: "Add New Product",
      description: "List a new product for vendors to order",
      icon: Plus,
      link: "/supplier/products",
      color: "bg-green-500",
    },
    {
      title: "View Orders",
      description: "Manage incoming orders from vendors",
      icon: Eye,
      link: "/supplier/orders",
      color: "bg-blue-500",
    },
    {
      title: "Switch to Vendor",
      description: "Browse and order products",
      icon: Users,
      link: "/vendor/dashboard",
      color: "bg-purple-500",
    },
  ]

  const dashboardStats = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "placed":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <div className="flex items-center justify-center min-h-64">
            <div className="loading-spinner" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}! 🏪</h1>
          <p className="text-gray-600 text-lg">Manage your products and orders from your supplier dashboard</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Link to={action.link} className="block">
                    <div className="card p-6 h-full">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}
                        >
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link to="/supplier/orders" className="text-primary-600 hover:text-primary-700 font-medium">
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders yet</p>
              <p className="text-gray-400 text-sm mt-2">Orders from vendors will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{order.productName}</h4>
                    <p className="text-sm text-gray-600">
                      {order.quantity} kg × ₹{order.productPrice} = ₹{order.totalAmount}
                    </p>
                    <p className="text-xs text-gray-500">From: {order.vendor?.name || "Vendor"}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
