const express = require("express")
const { body, validationResult } = require("express-validator")
const { auth, vendorAuth, supplierAuth } = require("../middleware/auth")
const Order = require("../models/Order")
const User = require("../models/User")

const router = express.Router()

// Place order (Vendor)
router.post(
  "/",
  auth,
  vendorAuth,
  [
    body("productName").trim().isLength({ min: 1 }).withMessage("Product name is required"),
    body("productPrice").isNumeric().withMessage("Product price must be a number"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("deliveryAddress.street").trim().isLength({ min: 1 }).withMessage("Street address is required"),
    body("deliveryAddress.city").trim().isLength({ min: 1 }).withMessage("City is required"),
    body("deliveryAddress.state").trim().isLength({ min: 1 }).withMessage("State is required"),
    body("deliveryAddress.pincode").trim().isLength({ min: 6, max: 6 }).withMessage("Pincode must be 6 digits"),
  ],
  async (req, res) => {
    try {
      console.log("Order request body:", JSON.stringify(req.body, null, 2))
      
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        console.log("Order validation errors:", JSON.stringify(errors.array(), null, 2))
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
          receivedData: req.body
        })
      }

      const { productName, productPrice, quantity, deliveryAddress, supplierId, notes } = req.body

      // If no supplierId provided, find a random supplier
      let finalSupplierId = supplierId
      if (!finalSupplierId) {
        const randomSupplier = await User.findOne({ userType: "supplier" })
        if (randomSupplier) {
          finalSupplierId = randomSupplier._id
        } else {
          return res.status(400).json({ message: "No suppliers available" })
        }
      }

      // Verify supplier exists
      const supplier = await User.findById(finalSupplierId)
      if (!supplier || supplier.userType !== "supplier") {
        return res.status(400).json({ message: "Invalid supplier" })
      }

      const totalAmount = productPrice * quantity

      const order = new Order({
        vendor: req.user._id,
        supplier: finalSupplierId,
        productName,
        productPrice,
        quantity,
        totalAmount,
        deliveryAddress,
        notes,
      })

      await order.save()

      // Populate order with user details
      await order.populate([
        { path: "vendor", select: "name email phone" },
        { path: "supplier", select: "name email phone" },
      ])

      // Emit real-time notification to supplier
      req.io.to(finalSupplierId.toString()).emit("new-order", {
        order,
        message: `New order received from ${req.user.name}`,
      })

      res.status(201).json({
        message: "Order placed successfully",
        order,
      })
    } catch (error) {
      console.error("Place order error:", error)
      res.status(500).json({ message: "Server error while placing order" })
    }
  },
)

// Get vendor orders
router.get("/vendor", auth, vendorAuth, async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user._id })
      .populate("supplier", "name email phone")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error("Get vendor orders error:", error)
    res.status(500).json({ message: "Server error while fetching orders" })
  }
})

// Get supplier orders
router.get("/supplier", auth, supplierAuth, async (req, res) => {
  try {
    const orders = await Order.find({ supplier: req.user._id })
      .populate("vendor", "name email phone")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error("Get supplier orders error:", error)
    res.status(500).json({ message: "Server error while fetching orders" })
  }
})

// Update order status (Supplier)
router.put("/:id/status", auth, supplierAuth, async (req, res) => {
  try {
    const { status } = req.body

    if (!["accepted", "rejected", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const order = await Order.findOne({
      _id: req.params.id,
      supplier: req.user._id,
    }).populate("vendor", "name email phone")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.status = status

    if (status === "accepted") {
      order.acceptedDate = new Date()
    } else if (status === "delivered") {
      order.deliveredDate = new Date()
    }

    await order.save()

    // Emit real-time update to vendor
    req.io.to(order.vendor._id.toString()).emit("order-status-update", {
      orderId: order._id,
      status,
      message: `Your order has been ${status}`,
    })

    res.json({
      message: `Order ${status} successfully`,
      order,
    })
  } catch (error) {
    console.error("Update order status error:", error)
    res.status(500).json({ message: "Server error while updating order status" })
  }
})

// Get single order
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("vendor", "name email phone")
      .populate("supplier", "name email phone")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if user has access to this order
    const hasAccess =
      order.vendor._id.toString() === req.user._id.toString() ||
      order.supplier._id.toString() === req.user._id.toString()

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Get order error:", error)
    res.status(500).json({ message: "Server error while fetching order" })
  }
})

module.exports = router
