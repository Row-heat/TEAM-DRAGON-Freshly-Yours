"use client"

import { useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import toast from "react-hot-toast"
import { ArrowLeft, MapPin, CreditCard, Package, Truck, CheckCircle } from "lucide-react"

const Order = () => {
  const { productId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state?.product

  const [orderData, setOrderData] = useState({
    quantity: 1,
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  if (!product) {
    return (
      <div className="page-container">
        <div className="content-wrapper text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button onClick={() => navigate("/vendor/products")} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1]
      setOrderData({
        ...orderData,
        deliveryAddress: {
          ...orderData.deliveryAddress,
          [addressField]: value,
        },
      })
    } else {
      setOrderData({
        ...orderData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderPayload = {
        productName: product.name,
        productPrice: product.price,
        quantity: Number.parseInt(orderData.quantity),
        deliveryAddress: orderData.deliveryAddress,
        // Remove hardcoded supplierId to let server find an available supplier
        notes: orderData.notes,
      }

      console.log("Placing order with payload:", orderPayload)

      const response = await axios.post("/orders", orderPayload)

      if (response.data.message) {
        setShowSuccess(true)
        toast.success("Order placed successfully!")

        // Redirect to orders page after 3 seconds
        setTimeout(() => {
          navigate("/vendor/orders")
        }, 3000)
      }
    } catch (error) {
      console.error("Order placement error:", error)
      toast.error(error.response?.data?.message || "Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = product.price * orderData.quantity

  if (showSuccess) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="card p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600 mb-6">
                Your order for {product.name} has been placed. You'll be redirected to your orders page shortly.
              </p>

              <button onClick={() => navigate("/vendor/orders")} className="btn-primary">
                View My Orders
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={() => navigate("/vendor/products")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Products</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Place Order</h1>
          <p className="text-gray-600">Complete your order for fresh ingredients</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Product Details</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={product.image || "/placeholder.svg?height=80&width=80&query=food"}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <div className="flex items-center space-x-2 text-gray-600 mt-1">
                    <MapPin size={16} />
                    <span className="text-sm">
                      {product.market}, {product.state}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price per kg:</span>
                  <span className="text-lg font-semibold">₹{product.price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="text-lg font-semibold">{orderData.quantity} kg</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-primary-600">₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (kg)</label>
                <input
                  type="number"
                  name="quantity"
                  value={orderData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  max="1000"
                  className="input-field"
                  required
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Delivery Address
                </label>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="address.street"
                    value={orderData.deliveryAddress.street}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    className="input-field"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="address.city"
                      value={orderData.deliveryAddress.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="input-field"
                      required
                    />
                    <input
                      type="text"
                      name="address.state"
                      value={orderData.deliveryAddress.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="input-field"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    name="address.pincode"
                    value={orderData.deliveryAddress.pincode}
                    onChange={handleInputChange}
                    placeholder="Pincode"
                    className="input-field"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <CreditCard className="inline w-4 h-4 mr-1" />
                  Payment Method
                </label>
                <div className="p-4 border-2 border-primary-200 bg-primary-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="font-medium text-primary-900">Cash on Delivery (COD)</div>
                      <div className="text-sm text-primary-700">Pay when your order is delivered</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
                <textarea
                  name="notes"
                  value={orderData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="Any special requirements or delivery instructions..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Placing Order...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Package size={20} />
                    <span>Place Order - ₹{totalAmount}</span>
                  </div>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Order
