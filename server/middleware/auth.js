const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token provided, access denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({ message: "Token is not valid" })
  }
}

const vendorAuth = (req, res, next) => {
  if (req.user.userType !== "vendor") {
    return res.status(403).json({ message: "Access denied. Vendor only." })
  }
  next()
}

const supplierAuth = (req, res, next) => {
  if (req.user.userType !== "supplier") {
    return res.status(403).json({ message: "Access denied. Supplier only." })
  }
  next()
}

module.exports = { auth, vendorAuth, supplierAuth }
