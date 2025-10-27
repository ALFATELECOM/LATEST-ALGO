# ALFA ALGO Trading System - Frontend

A modern, responsive trading platform built with Next.js, React, and TypeScript.

## 🌟 Features

- **Real-time Trading Dashboard** - Live portfolio tracking and P&L monitoring
- **Options Strategies** - Iron Condor, Butterfly, Straddle, Strangle
- **Risk Management** - Comprehensive risk metrics and controls
- **Market Data** - Real-time market indices and quotes
- **Strategy Management** - Start, stop, and monitor trading strategies
- **Order Management** - Place, modify, and cancel orders
- **Performance Analytics** - Detailed performance tracking and reporting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Live backend (https://latest-algo.onrender.com)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
The app is configured to use the live backend by default:
- `NEXT_PUBLIC_API_URL`: https://latest-algo.onrender.com
- `NEXT_PUBLIC_WS_URL`: wss://latest-algo.onrender.com

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx        # Main dashboard page
│   │   ├── layout.tsx      # Root layout
│   │   └── providers.tsx   # Context providers
│   ├── components/         # React components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── options/        # Options trading components
│   │   ├── auth/          # Authentication components
│   │   └── ui/            # Reusable UI components
│   ├── services/          # API services
│   │   └── api.ts         # Backend API client
│   └── lib/               # Utility functions
├── vercel.json            # Vercel deployment config
└── package.json           # Dependencies and scripts
```

## 🎨 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **State Management**: React Context + Zustand
- **Real-time**: Socket.io Client
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **AWS Amplify**: AWS ecosystem

## 🔗 Backend Integration

This frontend connects to the live backend at:
- **API**: https://latest-algo.onrender.com
- **WebSocket**: wss://latest-algo.onrender.com

## 📱 Responsive Design

- **Mobile**: Optimized for mobile devices
- **Tablet**: Perfect for tablet trading
- **Desktop**: Full-featured desktop experience

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Tailwind**: Utility-first CSS

## 🚀 Live Demo

Once deployed, your trading platform will be accessible at:
- **Frontend**: https://your-app-name.vercel.app
- **Backend**: https://latest-algo.onrender.com

## 📞 Support

For issues or questions:
1. Check the deployment logs
2. Verify backend connectivity
3. Review browser console for errors
4. Test API endpoints manually

---

**Built with ❤️ for algorithmic trading**
