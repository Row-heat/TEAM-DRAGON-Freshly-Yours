"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import toast from "react-hot-toast"
import { useSocket } from "../../context/SocketContext"
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Phone, Mail } from "lucide-react"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const { socket } = useSocket()

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("order-status-update", (data) => {
        // Update order status in real-time
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order._id === data.orderId ? { ...order, status: data.status } : order)),
        )
      })

      return () => {
        socket.off("order-status-update")
      }
    }
  }, [socket])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/orders/vendor")

      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "placed":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "delivered":
        return <Truck className="w-5 h-5 text-green-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

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

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true
    return order.status === filter
  })

  const filterOptions = [
    { value: "all", label: "All Orders", count: orders.length },
    { value: "placed", label: "Placed", count: orders.filter((o) => o.status === "placed").length },
    { value: "accepted", label: "Accepted", count: orders.filter((o) => o.status === "accepted").length },
    { value: "delivered", label: "Delivered", count: orders.filter((o) => o.status === "delivered").length },
    { value: "rejected", label: "Rejected", count: orders.filter((o) => o.status === "rejected").length },
  ]

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
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600 text-lg">Track and manage your orders</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === option.value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{filter === "all" ? "No orders found" : `No ${filter} orders`}</p>
              <p className="text-gray-400 text-sm mt-2">Start by browsing products and placing your first order</p>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="card p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{order.productName}</h3>
                            <p className="text-sm text-gray-500">Order ID: {order._id.slice(-8).toUpperCase()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">
                              Quantity: <span className="font-medium">{order.quantity} kg</span>
                            </p>
                            <p className="text-gray-600 mb-1">
                              Price: <span className="font-medium">₹{order.productPrice}/kg</span>
                            </p>
                            <p className="text-gray-600">
                              Total: <span className="font-medium text-primary-600">₹{order.totalAmount}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">
                              Order Date:{" "}
                              <span className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</span>
                            </p>
                            <p className="text-gray-600 mb-1">
                              Payment: <span className="font-medium">{order.paymentMethod}</span>
                            </p>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">Delivery Address:</p>
                              <p className="text-gray-600">
                                {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                                {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Supplier Info */}
                      <div className="lg:w-64">
                        <div className="p-4 bg-primary-50 rounded-lg">
                          <h4 className="font-medium text-primary-900 mb-2">Supplier Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Package className="w-4 h-4 text-primary-600" />
                              <span className="text-primary-800">{order.supplier?.name || "Supplier Name"}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-primary-600" />
                              <span className="text-primary-800">
                                {order.supplier?.email || "supplier@example.com"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-primary-600" />
                              <span className="text-primary-800">{order.supplier?.phone || "+91 9876543210"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">Note:</span> {order.notes}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Orders
