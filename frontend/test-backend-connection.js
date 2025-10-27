// ALFA ALGO Trading System - Backend Connection Test
// This script tests the connection between frontend and live backend

const API_BASE_URL = 'https://latest-algo.onrender.com';

async function testBackendConnection() {
  console.log('🚀 ALFA ALGO Trading System - Backend Connection Test');
  console.log('=' .repeat(60));
  
  const tests = [
    {
      name: 'Health Check',
      url: `${API_BASE_URL}/health`,
      method: 'GET'
    },
    {
      name: 'API Info',
      url: `${API_BASE_URL}/`,
      method: 'GET'
    },
    {
      name: 'Portfolio Data',
      url: `${API_BASE_URL}/api/v1/portfolio`,
      method: 'GET'
    },
    {
      name: 'Trading Strategies',
      url: `${API_BASE_URL}/api/v1/strategies`,
      method: 'GET'
    },
    {
      name: 'Options Strategies',
      url: `${API_BASE_URL}/api/v1/strategies/options`,
      method: 'GET'
    },
    {
      name: 'Market Indices',
      url: `${API_BASE_URL}/api/v1/market/indices`,
      method: 'GET'
    }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    try {
      console.log(`\n🔄 Testing ${test.name}...`);
      
      const response = await fetch(test.url, { method: test.method });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${test.name} - Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`);
    }
  }

  console.log('\n' + '=' .repeat(60));
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All backend endpoints are working perfectly!');
    console.log('✅ Frontend can connect to live backend');
    console.log('✅ Ready for production deployment');
  } else {
    console.log('⚠️  Some tests failed. Check backend status.');
  }
}

// Run the test
testBackendConnection().catch(console.error);
