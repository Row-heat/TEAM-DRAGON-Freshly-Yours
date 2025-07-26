const express = require("express")
const axios = require("axios")
const { auth, vendorAuth } = require("../middleware/auth")
const { fetchImagesForProducts } = require("../utils/imageUtils")

const router = express.Router()

// Get products from government API with real images
router.get("/products", auth, vendorAuth, async (req, res) => {
  try {
    const { search = "", limit = 50 } = req.query

    console.log("Fetching products from government API...")
    const response = await axios.get(process.env.PRODUCTS_API_URL, {
      params: {
        "api-key": process.env.PRODUCTS_API_KEY,
        offset: 0,
        limit: "all",
        format: "json",
      },
    })

    let products = response.data.records || []
    console.log(`Fetched ${products.length} products from government API`)

    // Filter products based on search
    if (search) {
      products = products.filter(
        (product) =>
          product.commodity?.toLowerCase().includes(search.toLowerCase()) ||
          product.market?.toLowerCase().includes(search.toLowerCase()) ||
          product.state?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Limit results for processing (to avoid API rate limits)
    products = products.slice(0, Number.parseInt(limit))

    console.log(`Processing ${products.length} products for images...`)

    // Transform products to standard format
    const standardProducts = products.map((product, index) => ({
      id: `gov-${product.commodity}-${product.market}-${index}`,
      name: product.commodity || "Unknown Product",
      price: Number.parseFloat(product.modal_price) || 0,
      market: product.market || "Unknown Market",
      state: product.state || "Unknown State",
      category: product.commodity || "General",
      unit: "per kg",
      date: product.arrival_date || new Date().toISOString().split('T')[0],
      originalData: product,
    }))

    // Fetch images for all products
    const productsWithImages = await fetchImagesForProducts(standardProducts, 150)
    
    console.log(`Successfully processed ${productsWithImages.length} products with images`)

    res.json({
      success: true,
      products: productsWithImages,
      total: productsWithImages.length,
      message: `Found ${productsWithImages.length} products with images out of ${standardProducts.length} total`,
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
