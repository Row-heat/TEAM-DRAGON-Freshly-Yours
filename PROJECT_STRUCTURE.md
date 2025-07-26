# Project Structure

```
freshly-yours-marketplace/
├── app/                          # Next.js app directory (Landing Page)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
│
├── client/                      # React frontend application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/             # React context providers
│   │   │   ├── AuthContext.jsx  # Authentication context
│   │   │   └── SocketContext.jsx # Socket.io context
│   │   ├── pages/               # Application pages
│   │   │   ├── auth/            # Authentication pages
│   │   │   ├── supplier/        # Supplier dashboard pages
│   │   │   └── vendor/          # Vendor dashboard pages
│   │   ├── App.jsx              # Main App component
│   │   └── main.jsx             # Application entry point
│   ├── package.json             # Client dependencies
│   └── vite.config.js           # Vite configuration
│
├── server/                      # Express.js backend
│   ├── middleware/              # Custom middleware
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/                  # MongoDB schemas
│   │   ├── Order.js             # Order model
│   │   ├── Product.js           # Product model
│   │   └── User.js              # User model
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── orders.js            # Order management routes
│   │   ├── supplier.js          # Supplier-specific routes
│   │   └── vendor.js            # Vendor-specific routes
│   ├── scripts/                 # Database seeding scripts
│   │   ├── seed-products.js     # Product seeding
│   │   ├── seed-suppliers.js    # Supplier seeding
│   │   └── simple-seed.js       # Combined seeding
│   ├── utils/                   # Utility functions
│   │   └── imageUtils.js        # Image fetching utilities
│   ├── .env.example             # Environment template
│   ├── package.json             # Server dependencies
│   ├── seed-data.js             # Main seeding script
│   └── server.js                # Express server entry point
│
├── components/                  # Shared UI components (Next.js)
│   ├── ui/                      # shadcn/ui components
│   └── theme-provider.tsx       # Theme provider
│
├── public/                      # Static assets
├── styles/                      # Global styles
├── .env.example                 # Root environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Root package.json
├── README.md                    # Project documentation
├── SETUP.md                     # Setup instructions
└── tailwind.config.ts           # Tailwind configuration
```

## Key Directories Explained

### `/app` - Next.js Landing Page
- Contains the marketing/landing page built with Next.js 14
- Provides entry points to the main application
- Includes navigation to vendor and supplier portals

### `/client` - React Frontend Application
- Main application built with React + Vite
- Contains all vendor and supplier dashboards
- Includes real-time features and responsive design

### `/server` - Express.js Backend
- RESTful API server with Socket.io integration
- MongoDB integration with Mongoose
- JWT authentication and authorization
- External API integrations (Government Data, Pixabay)

### Environment Files
- `.env.example` files provide templates for required environment variables
- Actual `.env` files are gitignored for security
- Contains database connections, API keys, and secrets

### Database Models
- **User**: Handles vendor and supplier accounts
- **Product**: Product listings and details
- **Order**: Order management and tracking

### API Integrations
- **Government Data API**: Fetches real product data
- **Pixabay API**: Provides product images
- **MongoDB Atlas**: Cloud database storage
