const express = require("express")
const { body, validationResult } = require("express-validator")
const { auth, supplierAuth } = require("../middleware/auth")
const Product = require("../models/Product")
const { fetchProductImage } = require("../utils/imageUtils")

const router = express.Router()

// Add product
router.post(
  "/products",
  auth,
  supplierAuth,
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Product name must be at least 2 characters"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    body("deliveryRadius").isInt({ min: 1, max: 100 }).withMessage("Delivery radius must be between 1-100 km"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { name, price, stock, category, description, deliveryRadius } = req.body

      // Fetch product image automatically
      console.log(`Fetching image for product: ${name}`)
      const imageData = await fetchProductImage(name, category)
      
      if (!imageData) {
        return res.status(400).json({
          message: "Could not find a suitable image for this product. Please try a different product name or category.",
          suggestion: "Try using more common product names like 'tomatoes', 'apples', 'rice', etc."
        })
      }

      const product = new Product({
        name,
        price,
        stock,
        category,
        description,
        deliveryRadius,
        image: imageData.url,
        supplier: req.user._id,
      })

      await product.save()

      res.status(201).json({
        message: "Product added successfully",
        product,
      })
    } catch (error) {
      console.error("Add product error:", error)
      res.status(500).json({ message: "Server error while adding product" })
    }
  },
)

// Get supplier's products
router.get("/products", auth, supplierAuth, async (req, res) => {
  try {
    const products = await Product.find({
      supplier: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 })

    res.json({
      success: true,
      products,
    })
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ message: "Server error while fetching products" })
  }
})

// Update product
router.put("/products/:id", auth, supplierAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      supplier: req.user._id,
    })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    Object.assign(product, req.body)
    await product.save()

    res.json({
      message: "Product updated successfully",
      product,
    })
  } catch (error) {
    console.error("Update product error:", error)
    res.status(500).json({ message: "Server error while updating product" })
  }
})

// Refresh product image
router.patch("/products/:id/refresh-image", auth, supplierAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      supplier: req.user._id,
    })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    console.log(`Refreshing image for product: ${product.name}`)
    const imageData = await fetchProductImage(product.name, product.category)
    
    if (!imageData) {
      return res.status(400).json({
        message: "Could not find a suitable image for this product",
        currentImage: product.image
      })
    }

    product.image = imageData.url
    await product.save()

    res.json({
      message: "Product image updated successfully",
      product,
      imageData: {
        url: imageData.url,
        thumbnail: imageData.thumbnail,
        tags: imageData.tags
      }
    })
  } catch (error) {
    console.error("Refresh image error:", error)
    res.status(500).json({ message: "Server error while refreshing image" })
  }
})

// Delete product
router.delete("/products/:id", auth, supplierAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      supplier: req.user._id,
    })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    product.isActive = false
    await product.save()

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json({ message: "Server error while deleting product" })
  }
})

// Cleanup products without images
router.post("/products/cleanup-no-images", auth, supplierAuth, async (req, res) => {
  try {
    // Find products without images for this supplier
    const productsWithoutImages = await Product.find({
      supplier: req.user._id,
      $or: [
        { image: "" },
        { image: null },
        { image: { $exists: false } }
      ]
    })

    const cleanupResults = []

    for (const product of productsWithoutImages) {
      console.log(`Trying to fetch image for existing product: ${product.name}`)
      const imageData = await fetchProductImage(product.name, product.category)
      
      if (imageData) {
        // Update with image
        product.image = imageData.url
        await product.save()
        cleanupResults.push({
          action: "updated",
          product: product.name,
          newImage: imageData.url
        })
      } else {
        // Remove product without image
        await Product.findByIdAndDelete(product._id)
        cleanupResults.push({
          action: "removed",
          product: product.name,
          reason: "No suitable image found"
        })
      }
      
      // Small delay to respect API limits
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    res.json({
      message: "Product cleanup completed",
      results: cleanupResults,
      summary: {
        total: productsWithoutImages.length,
        updated: cleanupResults.filter(r => r.action === "updated").length,
        removed: cleanupResults.filter(r => r.action === "removed").length
      }
    })
  } catch (error) {
    console.error("Cleanup error:", error)
    res.status(500).json({ message: "Server error during cleanup" })
  }
})

module.exports = router
