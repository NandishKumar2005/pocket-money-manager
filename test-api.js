// Quick API test script
const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get('http://localhost:4000/');
    console.log('✅ Health check:', health.data);
    
    // Test user registration
    console.log('\n2. Testing user registration...');
    try {
      const registerResponse = await axios.post(`${API_BASE}/users/register`, {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('✅ Registration successful:', registerResponse.data);
    } catch (regError) {
      if (regError.response?.status === 400 && regError.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️  User already exists, continuing...');
      } else {
        console.log('❌ Registration failed:', regError.response?.data || regError.message);
      }
    }
    
    // Test user login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE}/users/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful:', loginResponse.data);
    
    const token = loginResponse.data.token;
    
    // Test protected route
    console.log('\n4. Testing protected route...');
    const meResponse = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Protected route works:', meResponse.data);
    
    // Test transactions endpoint
    console.log('\n5. Testing transactions endpoint...');
    const transactionsResponse = await axios.get(`${API_BASE}/transactions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Transactions endpoint works:', transactionsResponse.data);
    
    console.log('\n🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testAPI();
