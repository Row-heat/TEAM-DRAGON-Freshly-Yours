const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const http = require("http")
const socketIo = require("socket.io")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const vendorRoutes = require("./routes/vendor")
const supplierRoutes = require("./routes/supplier")
const orderRoutes = require("./routes/orders")

const app = express()
const server = http.createServer(app)

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? "https://your-frontend-domain.vercel.app" : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
})

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "https://your-frontend-domain.vercel.app" : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
)
app.use(express.json())

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io
  next()
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/vendor", vendorRoutes)
app.use("/api/supplier", supplierRoutes)
app.use("/api/orders", orderRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Freshly Yours API is running!" })
})

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to Freshly Yours API", 
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      vendor: "/api/vendor", 
      supplier: "/api/supplier",
      orders: "/api/orders"
    }
  })
})

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-room", (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined room`)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas")
    const PORT = process.env.PORT || 5000
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

module.exports = { app, io }
