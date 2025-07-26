const mongoose = require("mongoose")
const path = require("path")

// Adjust the path to go up one level from scripts to server root
const User = require(path.join(__dirname, "../models/User"))
const Product = require(path.join(__dirname, "../models/Product"))

// Load environment variables from the server directory
require("dotenv").config({ path: path.join(__dirname, "../.env") })

const seedProducts = async () => {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB Atlas successfully!")

    // Find existing suppliers
    const suppliers = await User.find({ userType: "supplier" })

    if (suppliers.length === 0) {
      console.log("❌ No suppliers found. Please run seed-suppliers.js first.")
      process.exit(1)
    }

    console.log(`Found ${suppliers.length} suppliers`)

    // Sample products to create
    const sampleProducts = [
      {
        name: "Fresh Tomatoes",
        price: 25,
        stock: 100,
        category: "Vegetables",
        description: "Fresh red tomatoes, perfect for cooking",
        deliveryRadius: 15,
        image: "https://images.unsplash.com/photo-1546470427-e5ac89c8ba37?w=400",
      },
      {
        name: "Organic Onions",
        price: 20,
        stock: 150,
        category: "Vegetables",
        description: "Organic white onions, locally grown",
        deliveryRadius: 20,
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
      },
      {
        name: "Fresh Potatoes",
        price: 15,
        stock: 200,
        category: "Vegetables",
        description: "High quality potatoes for all cooking needs",
        deliveryRadius: 25,
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
      },
      {
        name: "Green Chilies",
        price: 40,
        stock: 50,
        category: "Spices",
        description: "Fresh green chilies, medium spice level",
        deliveryRadius: 10,
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400",
      },
      {
        name: "Fresh Coriander",
        price: 30,
        stock: 75,
        category: "Herbs",
        description: "Fresh coriander leaves for garnishing",
        deliveryRadius: 12,
        image: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400",
      },
      {
        name: "Basmati Rice",
        price: 80,
        stock: 300,
        category: "Grains",
        description: "Premium quality basmati rice",
        deliveryRadius: 30,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
      },
    ]

    console.log("Starting to seed products...")

    // Distribute products among suppliers
    for (let i = 0; i < sampleProducts.length; i++) {
      const productData = sampleProducts[i]
      const supplier = suppliers[i % suppliers.length] // Rotate through suppliers

      // Check if product already exists for this supplier
      const existingProduct = await Product.findOne({
        name: productData.name,
        supplier: supplier._id,
      })

      if (!existingProduct) {
        const product = new Product({
          ...productData,
          supplier: supplier._id,
        })
        await product.save()
        console.log(`✅ Created product: ${product.name} for supplier ${supplier.name}`)
      } else {
        console.log(`⚠️  Product already exists: ${productData.name} for supplier ${supplier.name}`)
      }
    }

    console.log("\n🎉 Product seeding completed successfully!")

    // Show summary
    const totalProducts = await Product.countDocuments()
    console.log(`\n📊 Total products in database: ${totalProducts}`)

    await mongoose.connection.close()
    console.log("\n📝 Database connection closed.")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding products:", error)
    await mongoose.connection.close()
    process.exit(1)
  }
}

// Run the seeding function
seedProducts()
