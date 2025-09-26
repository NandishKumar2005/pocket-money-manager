// Create test user for login
const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function createTestUser() {
  try {
    console.log('Creating test user for login...\n');
    
    // Create the user you were trying to login with
    const registerResponse = await axios.post(`${API_BASE}/users/register`, {
      name: 'Nandish Kumar',
      email: 'nandish@example.com',
      password: 'Nnadi@2005'
    });
    
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: nandish@example.com');
    console.log('🔑 Password: Nnadi@2005');
    console.log('🎯 You can now login with these credentials');
    
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('✅ Test user already exists!');
      console.log('📧 Email: nandish@example.com');
      console.log('🔑 Password: Nnadi@2005');
      console.log('🎯 You can login with these credentials');
    } else {
      console.error('❌ Failed to create test user:', error.response?.data || error.message);
    }
  }
}

createTestUser();
