export default function SimplePage() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>
        🚀 ALFA ALGO Trading System
      </h1>
      
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>✅ Deployment Successful!</h2>
        <p>Your trading platform is now live and running.</p>
      </div>

      <div style={{ 
        backgroundColor: '#ecfdf5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>🔗 Backend Status</h3>
        <p>Backend API: <a href="https://latest-algo.onrender.com" target="_blank" style={{ color: '#059669' }}>https://latest-algo.onrender.com</a></p>
        <p>Health Check: <a href="https://latest-algo.onrender.com/health" target="_blank" style={{ color: '#059669' }}>Check Status</a></p>
      </div>

      <div style={{ 
        backgroundColor: '#fef3c7', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>🎯 Features Available</h3>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>Real-time Portfolio Dashboard</li>
          <li>Options Trading Strategies</li>
          <li>Risk Management Tools</li>
          <li>Market Data Integration</li>
          <li>WebSocket Real-time Updates</li>
        </ul>
      </div>

      <div style={{ marginTop: '30px' }}>
        <a 
          href="/" 
          style={{ 
            backgroundColor: '#2563eb', 
            color: 'white', 
            padding: '12px 24px', 
            textDecoration: 'none', 
            borderRadius: '6px',
            display: 'inline-block'
          }}
        >
          Go to Main Dashboard
        </a>
      </div>
    </div>
  )
}
