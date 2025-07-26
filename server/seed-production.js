// Production seed script for Render deployment
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Environment variables
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    userType: { type: String, enum: ["vendor", "supplier"], required: true },
    phone: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

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

const User = mongoose.model("User", userSchema)
const Product = mongoose.model("Product", productSchema)

const seedProductionData = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...")
    await mongoose.connect(MONGO_URI)
    console.log("✅ Connected to MongoDB Atlas successfully!")

    // Check if data already exists
    const existingSuppliers = await User.countDocuments({ userType: "supplier" })
    const existingProducts = await Product.countDocuments()

    if (existingSuppliers > 0 && existingProducts > 0) {
      console.log("✅ Data already exists in production database")
      console.log(`   • Suppliers: ${existingSuppliers}`)
      console.log(`   • Products: ${existingProducts}`)
      process.exit(0)
    }

    // Sample suppliers data
    const suppliersData = [
      {
        name: "Fresh Farms Supply",
        email: "supplier1@freshfarms.com",
        password: "password123",
        userType: "supplier",
        phone: "+91 9876543210",
        address: {
          street: "123 Farm Road",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
        },
      },
      {
        name: "Green Valley Suppliers",
        email: "supplier2@greenvalley.com",
        password: "password123",
        userType: "supplier",
        phone: "+91 9876543211",
        address: {
          street: "456 Valley Street",
          city: "Delhi",
          state: "Delhi",
          pincode: "110001",
        },
      },
      {
        name: "Organic Harvest Co",
        email: "supplier3@organicharvest.com",
        password: "password123",
        userType: "supplier",
        phone: "+91 9876543212",
        address: {
          street: "789 Organic Lane",
          city: "Bangalore",
          state: "Karnataka",
          pincode: "560001",
        },
      },
    ]

    console.log("🔄 Creating suppliers...")
    const createdSuppliers = []

    // Create suppliers
    for (const supplierData of suppliersData) {
      const existingSupplier = await User.findOne({ email: supplierData.email })

      if (!existingSupplier) {
        const supplier = new User(supplierData)
        await supplier.save()
        createdSuppliers.push(supplier)
        console.log(`✅ Created supplier: ${supplier.name} (${supplier.email})`)
      } else {
        createdSuppliers.push(existingSupplier)
        console.log(`⚠️  Supplier already exists: ${supplierData.name} (${supplierData.email})`)
      }
    }

    // Sample products data with properly matched images - CORRECTED URLS
    const productsData = [
      {
        name: "Fresh Tomatoes",
        price: 25,
        stock: 100,
        category: "Vegetables",
        description: "Fresh red tomatoes, perfect for cooking",
        deliveryRadius: 15,
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80", // Fresh red tomatoes
      },
      {
        name: "Organic Onions",
        price: 20,
        stock: 150,
        category: "Vegetables",
        description: "Organic white onions, locally grown",
        deliveryRadius: 20,
        image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80", // White onions
      },
      {
        name: "Fresh Potatoes",
        price: 15,
        stock: 200,
        category: "Vegetables",
        description: "High quality potatoes for all cooking needs",
        deliveryRadius: 25,
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80", // Brown potatoes
      },
      {
        name: "Green Chilies",
        price: 40,
        stock: 50,
        category: "Spices",
        description: "Fresh green chilies, medium spice level",
        deliveryRadius: 10,
        image: "https://images.unsplash.com/photo-1525207902259-13015d7f0e28?w=400&q=80", // Green chilies
      },
      {
        name: "Fresh Coriander",
        price: 30,
        stock: 75,
        category: "Herbs",
        description: "Fresh coriander leaves for garnishing",
        deliveryRadius: 12,
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80", // Fresh coriander leaves
      },
      {
        name: "Basmati Rice",
        price: 80,
        stock: 300,
        category: "Grains",
        description: "Premium quality basmati rice",
        deliveryRadius: 30,
        image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=80", // Basmati rice grains
      },
    ]

    console.log("🔄 Creating products...")

    // Create products and distribute among suppliers
    for (let i = 0; i < productsData.length; i++) {
      const productData = productsData[i]
      const supplier = createdSuppliers[i % createdSuppliers.length] // Rotate through suppliers

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

    // Show final summary
    const totalSuppliers = await User.countDocuments({ userType: "supplier" })
    const totalProducts = await Product.countDocuments()

    console.log("\n🎉 Production database seeding completed successfully!")
    console.log(`\n📊 Summary:`)
    console.log(`   • Suppliers: ${totalSuppliers}`)
    console.log(`   • Products: ${totalProducts}`)

    console.log("\n🔑 Supplier Login Credentials:")
    suppliersData.forEach((supplier, index) => {
      console.log(`   ${index + 1}. Email: ${supplier.email} | Password: password123`)
    })

    console.log("\n🚀 Production database is ready!")

    await mongoose.connection.close()
    console.log("\n📝 Database connection closed.")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding production database:", error)
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
    }
    process.exit(1)
  }
}

// Run the seeding function
seedProductionData()
