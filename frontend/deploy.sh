#!/bin/bash
# ALFA ALGO Trading System - Frontend Deployment Script

echo "🚀 ALFA ALGO Trading System - Frontend Deployment"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy frontend to production - $(date)"

# Check if remote is set
if ! git remote | grep -q origin; then
    echo "⚠️  No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
    echo "📋 Manual deployment steps:"
    echo "1. Push to GitHub: git push -u origin main"
    echo "2. Go to vercel.com and import your repository"
    echo "3. Deploy automatically with Vercel"
    exit 1
fi

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Frontend code pushed to GitHub!"
echo ""
echo "🎯 Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Sign in with GitHub"
echo "3. Click 'New Project'"
echo "4. Import your repository"
echo "5. Click 'Deploy'"
echo ""
echo "🌍 Your app will be live at: https://your-app-name.vercel.app"
echo ""
echo "🔗 Backend is already live at: https://latest-algo.onrender.com"
