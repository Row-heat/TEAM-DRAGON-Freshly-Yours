const express = require("express")
const axios = require("axios")
const Product = require("../models/Product")
const User = require("../models/User")
const { auth, vendorAuth } = require("../middleware/auth")
const { fetchImagesForProducts } = require("../utils/imageUtils")

const router = express.Router()

// Get products from database (replacing government API)
router.get("/products", auth, vendorAuth, async (req, res) => {
  try {
    const { search = "", limit = 50 } = req.query

    console.log("Fetching products from database...")
    
    // Build search query
    let query = { isActive: true }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Fetch products from database with supplier info
    const products = await Product.find(query)
      .populate('supplier', 'name address.city address.state phone')
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    console.log(`Fetched ${products.length} products from database`)

    // Transform products to match frontend expectations
    const standardProducts = products.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description,
      deliveryRadius: product.deliveryRadius,
      image: product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
      supplier: {
        id: product.supplier._id,
        name: product.supplier.name,
        location: `${product.supplier.address?.city || 'Unknown'}, ${product.supplier.address?.state || 'India'}`,
        phone: product.supplier.phone
      },
      unit: "per kg",
      date: product.createdAt.toISOString().split('T')[0],
      isActive: product.isActive
    }))

    console.log(`Successfully processed ${standardProducts.length} products`)

    res.json({
      success: true,
      products: standardProducts,
      total: standardProducts.length,
      message: `Found ${standardProducts.length} products available for ordering`,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    })
  }
})

module.exports = router
