# ALFA ALGO Trading System - Frontend Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free)
- Your frontend code pushed to GitHub

### Step 1: Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial frontend deployment"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js
6. Environment variables are already configured in `vercel.json`
7. Click "Deploy"

### Step 3: Verify Deployment
- Your app will be available at `https://your-app-name.vercel.app`
- Check that it connects to backend at `https://latest-algo.onrender.com`

## 🔧 Alternative Deployment Options

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables in Netlify dashboard

### Railway
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Select Next.js template
4. Deploy automatically

## 🌐 Environment Variables

The following environment variables are configured:
- `NEXT_PUBLIC_API_URL`: https://latest-algo.onrender.com
- `NEXT_PUBLIC_WS_URL`: wss://latest-algo.onrender.com

## 📱 Features After Deployment

- ✅ **Live Frontend**: Accessible from anywhere
- ✅ **Backend Integration**: Connected to live API
- ✅ **Real-time Data**: WebSocket connection
- ✅ **Responsive Design**: Works on all devices
- ✅ **Fast Loading**: Optimized for production

## 🔍 Testing Your Deployment

1. **Health Check**: Visit `/health` endpoint
2. **API Connection**: Check browser console for backend connection
3. **WebSocket**: Verify real-time data updates
4. **All Features**: Test trading, strategies, portfolio views

## 🛠️ Troubleshooting

### Common Issues:
- **CORS Errors**: Backend CORS is configured for all origins
- **WebSocket Issues**: Check if backend supports WebSocket
- **API Errors**: Verify backend is running and accessible

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables
3. Test backend endpoints directly
4. Check Vercel deployment logs

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify backend is running
3. Test API endpoints manually
4. Check browser network tab for failed requests

---

**Your ALFA ALGO Trading System will be live and accessible worldwide! 🌍**
