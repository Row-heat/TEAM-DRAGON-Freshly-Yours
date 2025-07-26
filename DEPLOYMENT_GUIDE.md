# 🚀 Deployment Guide - Vercel (Frontend) + Render (Backend)

## 📋 Pre-Deployment Checklist

### 1. Push Your Code to GitHub (if not done)
```bash
# If you haven't pushed to GitHub yet:
git remote add origin https://github.com/YOUR_USERNAME/TEAM-DRAGON-Freshly-Yours.git
git branch -M main
git push -u origin main
```

---

## 🎯 Part 1: Deploy Backend on Render

### Step 1: Sign Up for Render
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `TEAM-DRAGON-Freshly-Yours`
3. Configure the service:
   - **Name**: `freshly-yours-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Add Environment Variables on Render
In the **Environment** tab, add these variables:

```
MONGO_URI=mongodb+srv://name:password@cluster0.aw43u8h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=freshly-yours-super-secret-jwt-key-2025-production-ready
PRODUCTS_API_URL=https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
PRODUCTS_API_KEY=your-key
PIXABAY_API_URL=https://pixabay.com/api/
PIXABAY_API_KEY=your-key
NODE_ENV=production
```

### Step 3.1: Fix Network Issues (If Build Fails)
If you get npm network errors, try these solutions:

**Option 1: Change Build Command**
- Build Command: `npm ci --production --no-optional`
- Or try: `npm install --production --registry https://registry.npmjs.org/`

**Option 2: Alternative Registry**
- Build Command: `npm install --registry https://registry.npmmirror.com/`

**Option 3: Retry Build**
- Simply click "Manual Deploy" to retry (network issues are often temporary)

### Step 4: Update server/package.json
Make sure your server has a start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 5: Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://team-dragon-freshly-yours-backend.onrender.com`

---

## 🌐 Part 2: Deploy Frontend on Vercel

### Step 1: Deploy React Client (Main App)

#### Option A: Via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Import `TEAM-DRAGON-Freshly-Yours`
5. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client folder
cd client

# Deploy
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name: freshly-yours-client
# - Directory: ./
# - Override build command? N
# - Override output directory? N
```

### Step 2: Configure Environment Variables on Vercel
In Vercel Dashboard → Your Project → Settings → Environment Variables:

```
VITE_API_URL=https://team-dragon-freshly-yours-backend.onrender.com/api
```

### Step 3: Deploy Next.js Landing Page (Optional)

```bash
# Navigate to root folder
cd ..

# Deploy with Vercel CLI
vercel

# Configure:
# - Framework: Next.js
# - Root directory: ./
```

---

## 🔧 Part 3: Update Code for Production

### 1. Update CORS in server/server.js
```javascript
// Add your Vercel domain to CORS
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://freshly-yours-client.vercel.app',
    'https://your-custom-domain.vercel.app'
  ],
  credentials: true
}));
```

### 2. Update API URL in Client
The environment variable `VITE_API_URL` will automatically be used by your React app.

### 3. Commit and Push Changes
```bash
git add .
git commit -m "feat: add production configurations for deployment"
git push origin main
```

---

## 🎯 Part 4: Testing Your Deployment

### Backend Testing (Render)
1. Open: `https://team-dragon-freshly-yours-backend.onrender.com`
2. Should see: `{"message":"Freshly Yours API is running!"}`
3. Test endpoints:
   - `GET /api/vendor/products` - Should return products
   - `POST /api/auth/register` - Test registration

### Frontend Testing (Vercel)
1. Open your Vercel URL: `https://freshly-yours-client.vercel.app`
2. Test complete user flow:
   - Register as vendor/supplier
   - Browse products
   - Place orders
   - Real-time notifications

---

## 🛠️ Troubleshooting Common Issues

### Issue 1: Backend "Application failed to respond"
**Solution**: Check Render logs
- Go to Render Dashboard → Your Service → Logs
- Common fix: Ensure `PORT` environment variable is set

### Issue 2: Frontend can't connect to backend
**Solution**: Check API URL
- Verify `VITE_API_URL` points to correct Render URL
- Check CORS configuration includes Vercel domain

### Issue 3: Database connection error
**Solution**: MongoDB Atlas IP whitelist
- Go to MongoDB Atlas → Network Access
- Add `0.0.0.0/0` to allow all IPs (for Render)

### Issue 4: Environment variables not working
**Solution**: Redeploy after adding variables
- Add variables in platform dashboard
- Trigger new deployment

---

## 📋 Final Deployment URLs

### Your Live Application:
- **Frontend (React App)**: `https://freshly-yours-client.vercel.app`
- **Backend API**: `https://team-dragon-freshly-yours-backend.onrender.com`
- **Landing Page**: `https://freshly-yours-marketplace.vercel.app`

### Test Credentials:
- **Supplier**: `supplier1@freshfarms.com` / `password123`
- **Vendor**: Register new account in the app

---

## 🎉 Success Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] CORS updated for production domains
- [ ] Database accessible from cloud
- [ ] All features working in production
- [ ] Real-time features (Socket.io) working
- [ ] Image loading from APIs working

**🚀 Your marketplace is now live and ready for users!**
