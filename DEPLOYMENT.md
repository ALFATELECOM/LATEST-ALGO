# 🚀 Deployment Guide - Vercel + Render

This guide will help you deploy the ALFA ALGO Trading System to Vercel (frontend) and Render (backend) without installing anything on your local machine.

## 📋 Prerequisites

- Vercel account (free at vercel.com)
- Render account (free at render.com)
- Zerodha API credentials
- GitHub account (optional, for easier deployment)

## 🎯 Deployment Steps

### Step 1: Prepare Your Project

1. **Zip your project folder**:
   - Right-click on `ALFA ALGO 2025 LATEST` folder
   - Select "Send to" → "Compressed (zipped) folder"
   - Name it `alfa-algo-trading.zip`

### Step 2: Deploy Backend to Render

1. **Go to Render.com** and sign up/login
2. **Click "New +"** → **"Web Service"**
3. **Upload your project**:
   - Choose "Upload a ZIP file"
   - Upload `alfa-algo-trading.zip`
   - Select the `backend` folder as the root directory
4. **Configure the service**:
   - Name: `alfa-algo-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Add Environment Variables**:
   ```
   ENVIRONMENT=production
   SECRET_KEY=your-secret-key-here
   ZERODHA_API_KEY=your-zerodha-api-key
   ZERODHA_API_SECRET=your-zerodha-api-secret
   ZERODHA_REDIRECT_URL=https://your-frontend-app.vercel.app/auth/callback
   CORS_ORIGINS=["https://your-frontend-app.vercel.app"]
   ALLOWED_HOSTS=["*"]
   ```
6. **Click "Create Web Service"**
7. **Note your backend URL** (e.g., `https://alfa-algo-backend.onrender.com`)

### Step 3: Deploy Frontend to Vercel

1. **Go to Vercel.com** and sign up/login
2. **Click "New Project"**
3. **Upload your project**:
   - Choose "Upload a ZIP file"
   - Upload `alfa-algo-trading.zip`
   - Select the `frontend` folder as the root directory
4. **Configure the project**:
   - Project Name: `alfa-algo-frontend`
   - Framework: Next.js (auto-detected)
5. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
   NEXT_PUBLIC_WS_URL=wss://your-backend-app.onrender.com
   ```
6. **Click "Deploy"**
7. **Note your frontend URL** (e.g., `https://alfa-algo-frontend.vercel.app`)

### Step 4: Update Configuration

1. **Update Vercel configuration**:
   - Go to your Vercel project settings
   - Update `vercel.json` with your actual backend URL
   - Redeploy if needed

2. **Update Render configuration**:
   - Go to your Render service settings
   - Update environment variables with your actual frontend URL
   - Restart the service

## 🔧 Configuration Details

### Backend Environment Variables (Render)

```env
ENVIRONMENT=production
SECRET_KEY=your-secret-key-here
ZERODHA_API_KEY=your-zerodha-api-key
ZERODHA_API_SECRET=your-zerodha-api-secret
ZERODHA_REDIRECT_URL=https://your-frontend-app.vercel.app/auth/callback
CORS_ORIGINS=["https://your-frontend-app.vercel.app"]
ALLOWED_HOSTS=["*"]
```

### Frontend Environment Variables (Vercel)

```env
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
NEXT_PUBLIC_WS_URL=wss://your-backend-app.onrender.com
```

## 🎯 Zerodha API Setup

1. **Go to Zerodha Developer Console**: https://developers.kite.trade/
2. **Create a new app**:
   - App name: `ALFA ALGO Trading`
   - Redirect URL: `https://your-frontend-app.vercel.app/auth/callback`
3. **Get your credentials**:
   - API Key
   - API Secret
4. **Add to Render environment variables**

## 📊 Access Your Application

After deployment:

- **Frontend**: https://your-frontend-app.vercel.app
- **Backend API**: https://your-backend-app.onrender.com
- **API Documentation**: https://your-backend-app.onrender.com/docs

## 🔄 Updates and Maintenance

### Updating Backend (Render)
1. Make changes to your local code
2. Zip the updated project
3. Go to Render dashboard
4. Click "Manual Deploy" → "Upload ZIP"
5. Upload the new zip file

### Updating Frontend (Vercel)
1. Make changes to your local code
2. Zip the updated project
3. Go to Vercel dashboard
4. Click "Redeploy" → "Upload ZIP"
5. Upload the new zip file

## 🆘 Troubleshooting

### Common Issues

1. **Backend not starting**:
   - Check environment variables
   - Check build logs in Render dashboard
   - Ensure all dependencies are in requirements.txt

2. **Frontend not connecting to backend**:
   - Verify API URL in environment variables
   - Check CORS settings in backend
   - Ensure backend is running

3. **Zerodha authentication issues**:
   - Verify redirect URL matches exactly
   - Check API credentials
   - Ensure HTTPS is used

### Getting Help

- **Render Support**: Check Render dashboard logs
- **Vercel Support**: Check Vercel dashboard logs
- **Zerodha Support**: Check Zerodha developer documentation

## 🎉 Success!

Once deployed, you'll have:
- ✅ Fully functional trading system
- ✅ Real-time data and updates
- ✅ Automated trading strategies
- ✅ Risk management system
- ✅ Modern web interface
- ✅ Mobile-responsive design

Your ALFA ALGO Trading System is now live and ready for paper trading!
