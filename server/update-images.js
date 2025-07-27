// Update existing products with proper images
const mongoose = require("mongoose")
require('dotenv').config()

// Environment variables
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    description: { type: String, trim: true },
    deliveryRadius: { type: Number, required: true, min: 1, max: 100 },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const Product = mongoose.model("Product", productSchema)

const updateProductImages = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...")
    await mongoose.connect(MONGO_URI)
    console.log("✅ Connected to MongoDB Atlas successfully!")

    // USER PROVIDED WORKING IMAGE URLS - FINAL FIX FOR SUBMISSION
    const imageUpdates = [
      {
        name: "Fresh Tomatoes",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80", // VERIFIED: Fresh red tomatoes
      },
      {
        name: "Organic Onions",
        image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80", // VERIFIED: White onions
      },
      {
        name: "Fresh Potatoes", 
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80", // VERIFIED: Brown potatoes
      },
      {
        name: "Green Chilies",
        image: "https://images.unsplash.com/photo-1576763595295-c0371a32af78?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // USER PROVIDED: Green chilies
      },
      {
        name: "Fresh Coriander",
        image: "https://images.unsplash.com/photo-1535189487909-a262ad10c165?q=80&w=1099&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // USER PROVIDED: Fresh coriander
      },
      {
        name: "Basmati Rice",
        image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=80", // VERIFIED: Basmati rice
      },
    ]

    console.log("🔄 Updating product images...")

    // Update each product
    for (const update of imageUpdates) {
      const result = await Product.updateOne(
        { name: update.name },
        { image: update.image }
      )

      if (result.matchedCount > 0) {
        console.log(`✅ Updated image for: ${update.name}`)
      } else {
        console.log(`⚠️  Product not found: ${update.name}`)
      }
    }

    // Check final results
    const updatedProducts = await Product.find({}).select('name image')
    console.log("\n📊 Updated Products:")
    updatedProducts.forEach(product => {
      console.log(`   • ${product.name}: ${product.image}`)
    })

    console.log("\n🎉 Product images updated successfully!")

    await mongoose.connection.close()
    console.log("\n📝 Database connection closed.")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error updating product images:", error)
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
    }
    process.exit(1)
  }
}

// Run the update function
updateProductImages()
