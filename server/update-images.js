// Update existing products with proper images
const mongoose = require("mongoose")

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

    // Define proper image mappings with ACCURATE PRODUCT MATCHING
    const imageUpdates = [
      {
        name: "Fresh Tomatoes",
        image: "https://images.unsplash.com/photo-1546470427-e75e0dcbb19c?w=400&q=80", // Fresh red tomatoes on vine
      },
      {
        name: "Organic Onions",
        image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80", // Fresh white onions
      },
      {
        name: "Fresh Potatoes", 
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80", // Clean brown potatoes
      },
      {
        name: "Green Chilies",
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80", // Fresh green chilies
      },
      {
        name: "Fresh Coriander",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80", // Fresh coriander leaves
      },
      {
        name: "Basmati Rice",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", // Premium basmati rice
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
