export default function Home() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        🚀 ALFA ALGO Trading System
      </h1>
      
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        padding: '30px', 
        borderRadius: '15px',
        marginBottom: '30px',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>✅ Deployment Successful!</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
          Your advanced algorithmic trading platform is now live and running.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: '#4ade80', marginBottom: '15px' }}>🔗 Backend Status</h3>
          <p>API: <a href="https://latest-algo.onrender.com" target="_blank" style={{ color: '#60a5fa' }}>https://latest-algo.onrender.com</a></p>
          <p>Health: <a href="https://latest-algo.onrender.com/health" target="_blank" style={{ color: '#60a5fa' }}>Check Status</a></p>
        </div>

        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: '#fbbf24', marginBottom: '15px' }}>🎯 Features</h3>
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
            <li>📊 Real-time Portfolio Dashboard</li>
            <li>📈 Options Trading Strategies</li>
            <li>⚠️ Risk Management Tools</li>
            <li>📡 Market Data Integration</li>
            <li>🔄 WebSocket Updates</li>
          </ul>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '30px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ color: '#a78bfa', marginBottom: '15px' }}>🚀 Quick Actions</h3>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="https://latest-algo.onrender.com/docs" 
            target="_blank"
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '12px 24px', 
              textDecoration: 'none', 
              borderRadius: '8px',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
          >
            📚 API Documentation
          </a>
          <a 
            href="https://latest-algo.onrender.com/health" 
            target="_blank"
            style={{ 
              backgroundColor: '#10b981', 
              color: 'white', 
              padding: '12px 24px', 
              textDecoration: 'none', 
              borderRadius: '8px',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
          >
            ❤️ Health Check
          </a>
        </div>
      </div>

      <div style={{ 
        fontSize: '0.9rem', 
        opacity: 0.8,
        marginTop: '40px'
      }}>
        <p>Built with Next.js, React, TypeScript, and FastAPI</p>
        <p>Deployed on Vercel + Render</p>
      </div>
    </div>
  )
}