// Simple seeding script - run with: node seed-data.js
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Environment variables
const MONGO_URI =
  "mongodb+srv://dragont931:teamdragon123@cluster0.aw43u8h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.model("User", userSchema)

async function seedSuppliers() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Connected to MongoDB")

    const suppliers = [
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

    for (const supplierData of suppliers) {
      const existing = await User.findOne({ email: supplierData.email })
      if (!existing) {
        const supplier = new User(supplierData)
        await supplier.save()
        console.log(`Created: ${supplier.name}`)
      } else {
        console.log(`Exists: ${supplierData.name}`)
      }
    }

    console.log("Seeding completed!")
    console.log("\nLogin credentials:")
    console.log("Email: supplier1@freshfarms.com | Password: password123")
    console.log("Email: supplier2@greenvalley.com | Password: password123")
    console.log("Email: supplier3@organicharvest.com | Password: password123")

    process.exit(0)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

seedSuppliers()
