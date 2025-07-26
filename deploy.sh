#!/bin/bash

# Deployment script for Freshly Yours

echo "🚀 Preparing for deployment..."

# Build the client
echo "📦 Building client..."
cd client
npm run build

# Go back to root
cd ..

# Show deployment URLs
echo "✅ Build complete!"
echo ""
echo "🌐 Deploy URLs:"
echo "Frontend (Vercel): Connect to client folder"
echo "Backend (Render): Connect to server folder" 
echo ""
echo "📋 Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy backend on Render"
echo "3. Deploy frontend on Vercel"
echo "4. Update environment variables"
