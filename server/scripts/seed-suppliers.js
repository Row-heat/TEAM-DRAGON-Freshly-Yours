const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const path = require("path")

// Adjust the path to go up one level from scripts to server root
const User = require(path.join(__dirname, "../models/User"))

// Load environment variables from the server directory
require("dotenv").config({ path: path.join(__dirname, "../.env") })

const seedSuppliers = async () => {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB Atlas successfully!")

    // Create sample suppliers
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

    console.log("Starting to seed suppliers...")

    // Check if suppliers already exist and create them
    for (const supplierData of suppliers) {
      const existingSupplier = await User.findOne({ email: supplierData.email })

      if (!existingSupplier) {
        const supplier = new User(supplierData)
        await supplier.save()
        console.log(`✅ Created supplier: ${supplier.name} (${supplier.email})`)
      } else {
        console.log(`⚠️  Supplier already exists: ${supplierData.name} (${supplierData.email})`)
      }
    }

    console.log("\n🎉 Supplier seeding completed successfully!")
    console.log("\nYou can now login with these supplier accounts:")
    suppliers.forEach((supplier, index) => {
      console.log(`${index + 1}. Email: ${supplier.email} | Password: password123`)
    })

    await mongoose.connection.close()
    console.log("\n📝 Database connection closed.")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding suppliers:", error)
    await mongoose.connection.close()
    process.exit(1)
  }
}

// Run the seeding function
seedSuppliers()
