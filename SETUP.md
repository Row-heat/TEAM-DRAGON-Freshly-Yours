# Freshly Yours - Setup Instructions

## 🚀 Quick Start Guide

### 1. Install Dependencies
\`\`\`bash
# Install all dependencies (root, server, client)
npm run setup
\`\`\`

### 2. Seed Database
\`\`\`bash
# Create sample suppliers in database
npm run seed
\`\`\`

### 3. Start Development Servers
\`\`\`bash
# Start both backend and frontend servers
npm run dev
\`\`\`

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🔑 Test Accounts

### Supplier Accounts (Pre-created)
1. **Email**: supplier1@freshfarms.com | **Password**: password123
2. **Email**: supplier2@greenvalley.com | **Password**: password123  
3. **Email**: supplier3@organicharvest.com | **Password**: password123

### Vendor Account
- Register a new vendor account through the application

## 🧪 Testing the Application

### As a Vendor:
1. Go to http://localhost:5173
2. Click "Sign up here" and register as a vendor
3. Browse products from the "Products" page
4. Click "Order Now" on any product
5. Fill in delivery details and place order
6. Check "My Orders" to track status

### As a Supplier:
1. Go to http://localhost:5173
2. Login with one of the supplier accounts above
3. Add products in "My Products" section
4. Go to "Orders" to see incoming orders
5. Accept/reject orders and mark as delivered
6. See real-time notifications when vendors place orders

## 🔧 Manual Setup (Alternative)

If the quick start doesn't work, follow these steps:

### Backend Setup
\`\`\`bash
cd server
npm install
node seed-data.js  # Seed database
npm run dev        # Start backend server
\`\`\`

### Frontend Setup
\`\`\`bash
cd client
npm install
npm run dev        # Start frontend server
\`\`\`

## 🌐 Environment Variables

The application uses these environment variables (already configured):

### Server (.env)
\`\`\`
MONGO_URI=mongodb+srv://<name>:<password>@cluster0.aw43u8h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
PIXABAY_KEY=your-key
PORT=5000
NODE_ENV=development
\`\`\`

### Client (.env)
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

## 🎯 Key Features to Test

✅ **User Authentication** - Register/Login for vendors and suppliers
✅ **Product Browsing** - Government API integration with live data
✅ **Order Management** - Complete order lifecycle from placement to delivery
✅ **Real-time Notifications** - Socket.io for instant updates
✅ **User Role Switching** - Switch between vendor and supplier views
✅ **Responsive Design** - Works on desktop and mobile
✅ **COD Payments** - Cash on delivery payment method

## 🚨 Troubleshooting

### Common Issues:

1. **Port already in use**
   \`\`\`bash
   # Kill processes on ports 5000 and 5173
   npx kill-port 5000 5173
   \`\`\`

2. **Database connection error**
   - Check if MongoDB URI is correct in server/.env
   - Ensure internet connection for MongoDB Atlas

3. **Module not found errors**
   \`\`\`bash
   # Reinstall dependencies
   rm -rf node_modules server/node_modules client/node_modules
   npm run setup
   \`\`\`

4. **API errors**
   - Check if backend server is running on port 5000
   - Verify environment variables are set correctly

## 📱 Application Flow

1. **Vendor Journey**: Register → Browse Products → Place Order → Track Status
2. **Supplier Journey**: Login → Add Products → Receive Orders → Manage Orders
3. **Real-time Updates**: Instant notifications for order status changes

## 🎉 Success!

If everything is working correctly, you should see:
- Beautiful responsive UI with smooth animations
- Real-time notifications when orders are placed/updated
- Government API data mixed with local supplier products
- Complete order management workflow

Happy testing! 🚀
