const express = require("express")
const axios = require("axios")
const Product = require("../models/Product")
const User = require("../models/User")
const { auth, vendorAuth } = require("../middleware/auth")
const { fetchImagesForProducts } = require("../utils/imageUtils")

const router = express.Router()

// Public endpoint to test products (for debugging)
router.get("/products-public", async (req, res) => {
  try {
    console.log("Fetching products from database (public endpoint)...")
    
    // Fetch products from database with supplier info
    const products = await Product.find({ isActive: true })
      .populate('supplier', 'name address.city address.state phone')
      .limit(20)
      .sort({ createdAt: -1 })

    console.log(`Fetched ${products.length} products from database`)

    // Product name to image mapping
    const getProductImage = (productName) => {
      const name = productName.toLowerCase();
      
      // USER PROVIDED WORKING URLS - FINAL FIX
      const imageMap = {
        // Core products in database - USER VERIFIED URLS
        'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80', // VERIFIED: Fresh red tomatoes
        'onion': 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80', // VERIFIED: White onions
        'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80', // VERIFIED: Brown potatoes
        'chili': 'https://images.unsplash.com/photo-1576763595295-c0371a32af78?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // USER PROVIDED: Green chilies
        'chilies': 'https://images.unsplash.com/photo-1576763595295-c0371a32af78?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // USER PROVIDED: Green chilies
        'coriander': 'https://images.unsplash.com/photo-1535189487909-a262ad10c165?q=80&w=1099&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // USER PROVIDED: Fresh coriander
        'rice': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=80', // VERIFIED: Basmati rice
        // Additional vegetables
        'carrot': 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&q=80',
        'cabbage': 'https://images.unsplash.com/photo-1594282486581-4b0b1e5b2d8c?w=400&q=80',
        'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
        'cucumber': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80',
        'cauliflower': 'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=400&q=80',
        'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80'
      };
      
      // Find matching image based on product name
      for (const [key, image] of Object.entries(imageMap)) {
        if (name.includes(key)) {
          return image;
        }
      }
      
      // Return null if no matching image found
      return null;
    };

    // Transform products and filter out those without proper images
    const allProducts = products.map((product) => {
      const productImage = product.image || getProductImage(product.name);
      
      return {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        description: product.description,
        deliveryRadius: product.deliveryRadius,
        image: productImage,
        supplier: {
          id: product.supplier._id,
          name: product.supplier.name,
          location: `${product.supplier.address?.city || 'Unknown'}, ${product.supplier.address?.state || 'India'}`,
          phone: product.supplier.phone
        },
        unit: "per kg",
        date: product.createdAt.toISOString().split('T')[0],
        isActive: product.isActive
      };
    });

    // Filter out products without proper images
    const standardProducts = allProducts.filter(product => product.image !== null);

    res.json({
      success: true,
      products: standardProducts,
      total: standardProducts.length,
      message: `Found ${standardProducts.length} products available`,
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

    // Product name to image mapping function
    const getProductImage = (productName) => {
      const name = productName.toLowerCase();
      
      // USER PROVIDED WORKING URLS - FINAL FIX
      const imageMap = {
        // Core products in database - USER VERIFIED URLS
        'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80', // VERIFIED: Fresh red tomatoes
        'onion': 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80', // VERIFIED: White onions
        'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80', // VERIFIED: Brown potatoes
        'chili': 'https://images.unsplash.com/photo-1576763595295-c0371a32af78?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // USER PROVIDED: Green chilies
        'chilies': 'https://images.unsplash.com/photo-1576763595295-c0371a32af78?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // USER PROVIDED: Green chilies
        'coriander': 'https://images.unsplash.com/photo-1535189487909-a262ad10c165?q=80&w=1099&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // USER PROVIDED: Fresh coriander
        'rice': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=80', // VERIFIED: Basmati rice
        // Additional vegetables
        'carrot': 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&q=80',
        'cabbage': 'https://images.unsplash.com/photo-1594282486581-4b0b1e5b2d8c?w=400&q=80',
        'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
        'cucumber': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80',
        'cauliflower': 'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=400&q=80',
        'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80'
      };
      
      // Find matching image based on product name
      for (const [key, image] of Object.entries(imageMap)) {
        if (name.includes(key)) {
          return image;
        }
      }
      
      // Return null if no matching image found
      return null;
    };

    // Transform products and filter out those without proper images
    const allProducts = products.map((product) => {
      const productImage = product.image || getProductImage(product.name);
      
      return {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        description: product.description,
        deliveryRadius: product.deliveryRadius,
        image: productImage,
        supplier: {
          id: product.supplier._id,
          name: product.supplier.name,
          location: `${product.supplier.address?.city || 'Unknown'}, ${product.supplier.address?.state || 'India'}`,
          phone: product.supplier.phone
        },
        unit: "per kg",
        date: product.createdAt.toISOString().split('T')[0],
        isActive: product.isActive
      };
    });

    // Filter out products without proper images
    const standardProducts = allProducts.filter(product => product.image !== null);

    console.log(`Successfully processed ${standardProducts.length} products with proper images`)

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
