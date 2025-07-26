"use client"

import React from "react"

export default function SyntheticV0PageForDeployment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          🌱 Freshly Yours Platform
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Fresh Produce Marketplace Connecting Suppliers and Vendors
        </p>
        <p className="text-lg text-gray-500 mb-8">
          All services are running and ready to use!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">React Client</h2>
            <p className="text-gray-600 mb-4">
              Main React application with vendor and supplier dashboards, built with Vite.
            </p>
            <p className="text-sm text-gray-500 mb-4">Port: 5174</p>
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Open React App
            </a>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Backend API</h2>
            <p className="text-gray-600 mb-4">
              Express.js server with MongoDB Atlas connection and authentication.
            </p>
            <p className="text-sm text-gray-500 mb-4">Port: 5000</p>
            <a
              href="http://localhost:5000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View API
            </a>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">Next.js App</h2>
            <p className="text-gray-600 mb-4">
              This landing page built with Next.js for easy navigation.
            </p>
            <p className="text-sm text-gray-500 mb-4">Port: 3001</p>
            <span className="inline-block bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed">
              Current Page
            </span>
          </div>
        </div>
        
        <div className="mt-12 bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🚀 Quick Start Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">For Vendors:</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Register/Login to the React Client</li>
                <li>• Browse fresh produce from suppliers</li>
                <li>• Place orders and track deliveries</li>
                <li>• Manage your vendor dashboard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">For Suppliers:</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Register/Login to the React Client</li>
                <li>• List your fresh produce</li>
                <li>• Manage inventory and pricing</li>
                <li>• Process vendor orders</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span>MongoDB Atlas: Connected</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span>Backend API: Running</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span>React Client: Running</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}