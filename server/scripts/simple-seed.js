const mongoose = require("mongoose")

// Direct schema definitions to avoid path issues
const bcrypt = require("bcryptjs")

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

const seedDatabase = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ Connected to MongoDB Atlas successfully!")

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

    // Sample products data
    const productsData = [
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
      {
        name: "Fresh Ginger",
        price: 35,
        stock: 80,
        category: "Spices",
        description: "Fresh ginger root for cooking and tea",
        deliveryRadius: 18,
        image: "https://images.unsplash.com/photo-1599909533730-b5b6b3b8b1c0?w=400",
      },
      {
        name: "Organic Carrots",
        price: 22,
        stock: 120,
        category: "Vegetables",
        description: "Fresh organic carrots, rich in vitamins",
        deliveryRadius: 20,
        image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400",
      },
      {
        name: "Fresh Mint Leaves",
        price: 25,
        stock: 60,
        category: "Herbs",
        description: "Fresh mint leaves for drinks and cooking",
        deliveryRadius: 15,
        image: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400",
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

    console.log("\n🎉 Database seeding completed successfully!")
    console.log(`\n📊 Summary:`)
    console.log(`   • Suppliers: ${totalSuppliers}`)
    console.log(`   • Products: ${totalProducts}`)

    console.log("\n🔑 Supplier Login Credentials:")
    suppliersData.forEach((supplier, index) => {
      console.log(`   ${index + 1}. Email: ${supplier.email} | Password: password123`)
    })

    console.log("\n🚀 Your application is ready to use!")
    console.log("   • Start backend: cd server && npm run dev")
    console.log("   • Start frontend: cd client && npm run dev")

    await mongoose.connection.close()
    console.log("\n📝 Database connection closed.")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
    }
    process.exit(1)
  }
}

// Set environment variables directly for the script
process.env.MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://dragont931:teamdragon123@cluster0.aw43u8h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
process.env.JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_here_make_it_long_and_secure"

// Run the seeding function
seedDatabase()
