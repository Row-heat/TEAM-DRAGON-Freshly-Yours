"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import { useAuth } from "./AuthContext"
import toast from "react-hot-toast"

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        transports: ["websocket", "polling"],
      })

      newSocket.on("connect", () => {
        console.log("Connected to server")
        setConnected(true)
        // Join user-specific room
        newSocket.emit("join-room", user.id)
      })

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server")
        setConnected(false)
      })

      // Listen for new orders (suppliers)
      newSocket.on("new-order", (data) => {
        toast.success(data.message, {
          duration: 5000,
          icon: "🛒",
        })
      })

      // Listen for order status updates (vendors)
      newSocket.on("order-status-update", (data) => {
        toast.success(data.message, {
          duration: 5000,
          icon: "📦",
        })
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    } else {
      // Clean up socket when user logs out
      if (socket) {
        socket.close()
        setSocket(null)
        setConnected(false)
      }
    }
  }, [user])

  const value = {
    socket,
    connected,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
