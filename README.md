# Freshly Yours - MERN Stack Application

A digital platform helping Indian street food vendors source raw materials from verified suppliers.

## 👥 Team Members & Contributions

| Name   | GitHub Username                                      | Role                      | Key Contributions                                              |
|--------|------------------------------------------------------|---------------------------|----------------------------------------------------------------|
| Rohit  | [@Row-heat](https://github.com/Row-heat)             | Fullstack Developer       | Authentication system, backend APIs, vendor-supplier workflows |
| Nawraj | [@Nawraj-07](https://github.com/Nawraj-07)           | Frontend Developer        | Responsive UI, Tailwind design, product card integration        |
| Anuj   | [@anuj-singh-dev02](https://github.com/anuj-singh-dev02) | Realtime & DB Integration | Socket.io real-time updates, MongoDB models, order logic        |

## 🔐 Test Accounts

### 🛒 Supplier Accounts (Pre-created)

| Email                             | Password      |
|----------------------------------|---------------|
| supplier1@freshfarms.com         | password123   |
| supplier2@greenvalley.com        | password123   |
| supplier3@organicharvest.com     | password123   |

### 👨‍🍳 Vendor Account

You can register a new vendor account directly through the application using the signup form.


## 🚀 Features

### Vendor Features
- Browse products from government API with real-time images
- Place COD orders with delivery address
- Track order status in real-time
- View order history and details

### Supplier Features
- Add and manage product listings
- Receive real-time order notifications
- Accept/reject/deliver orders
- Dashboard with analytics

### Technical Features
- JWT-based authentication
- Real-time updates with Socket.io
- Responsive design with TailwindCSS
- Smooth animations with Framer Motion
- MongoDB Atlas integration
- Government API integration for products
- Pixabay API for product images

## 🛠️ Tech Stack

**Frontend:**
- React.js 18
- TailwindCSS
- Framer Motion
- React Router DOM
- Axios
- Socket.io Client
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas
- Socket.io
- JWT Authentication
- bcryptjs
- Axios

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Pixabay API key

### Backend Setup

1. Navigate to server directory:
\`\`\`bash
cd server
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file with:
\`\`\`env
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.aw43u8h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
PIXABAY_KEY=your-pixabay-api-key-here
PORT=5000
NODE_ENV=development
\`\`\`

4. Seed sample suppliers (optional):
\`\`\`bash
node scripts/seed-suppliers.js
\`\`\`

5. Start the server:
\`\`\`bash
npm run dev
\`\`\`

### Frontend Setup

1. Navigate to client directory:
\`\`\`bash
cd client
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file with:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy with build command: `npm install`
4. Start command: `npm start`

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variables in Vercel dashboard

## 📱 Usage

### For Vendors:
1. Register as a vendor
2. Browse products from the products page
3. Click "Order Now" to place an order
4. Fill delivery details and confirm
5. Track order status in "My Orders"

### For Suppliers:
1. Register as a supplier
2. Add products in "My Products"
3. Receive real-time order notifications
4. Manage orders in "Orders" section
5. Accept/reject and mark orders as delivered

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Vendor
- `GET /api/vendor/products` - Get products from government API

### Supplier
- `GET /api/supplier/products` - Get supplier's products
- `POST /api/supplier/products` - Add new product
- `PUT /api/supplier/products/:id` - Update product
- `DELETE /api/supplier/products/:id` - Delete product

### Orders
- `POST /api/orders` - Place order (vendor)
- `GET /api/orders/vendor` - Get vendor orders
- `GET /api/orders/supplier` - Get supplier orders
- `PUT /api/orders/:id/status` - Update order status (supplier)

## 🎨 UI Components

- Responsive navigation with user switching
- Animated product cards
- Real-time toast notifications
- Loading spinners and states
- Modal confirmations
- Status badges and indicators

## 🔄 Real-time Features

- New order notifications for suppliers
- Order status updates for vendors
- Live dashboard updates
- Socket.io room-based messaging

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected routes middleware
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📊 Database Schema

### User Model
\`\`\`javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  userType: "vendor" | "supplier",
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  }
}
\`\`\`

### Product Model
\`\`\`javascript
{
  name: String,
  price: Number,
  stock: Number,
  category: String,
  description: String,
  deliveryRadius: Number,
  supplier: ObjectId (ref: User),
  image: String
}
\`\`\`

### Order Model
\`\`\`javascript
{
  vendor: ObjectId (ref: User),
  supplier: ObjectId (ref: User),
  productName: String,
  productPrice: Number,
  quantity: Number,
  totalAmount: Number,
  deliveryAddress: Object,
  paymentMethod: "COD",
  status: "placed" | "accepted" | "rejected" | "delivered",
  orderDate: Date,
  notes: String
}
\`\`\`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB URI is correct
   - Ensure network access is allowed in MongoDB Atlas

2. **Socket.io Connection Issues**
   - Verify CORS settings
   - Check if ports are properly configured

3. **API Rate Limits**
   - Government API and Pixabay have rate limits
   - Implement caching if needed

4. **Image Loading Issues**
   - Fallback to placeholder images
   - Handle image load errors gracefully

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Government of India for the open data API
- Pixabay for the image API
- MongoDB Atlas for database hosting
- Vercel and Render for deployment platforms

---

**Built with ❤️ for Indian street food vendors and suppliers**
