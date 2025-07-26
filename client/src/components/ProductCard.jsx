"use client"
import { motion } from "framer-motion"
import { MapPin, Tag, ShoppingCart } from "lucide-react"

const ProductCard = ({ product, onOrderClick, showOrderButton = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="card p-6 group"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "/placeholder.svg"
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">Fresh</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>

        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin size={16} />
          <span className="text-sm">
            {product.market}, {product.state}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <Tag size={16} />
          <span className="text-sm capitalize">{product.category}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600">
            ₹{product.price}
            <span className="text-sm font-normal text-gray-500">/kg</span>
          </div>

          {showOrderButton && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOrderClick(product)}
              className="btn-primary flex items-center space-x-2"
            >
              <ShoppingCart size={16} />
              <span>Order Now</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
