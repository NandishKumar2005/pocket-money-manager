// Create sample transactions for testing
const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function createSampleData() {
  try {
    console.log('Creating sample data...\n');
    
    // First try to create user, then login
    try {
      await axios.post(`${API_BASE}/users/register`, {
        name: 'Nandish Kumar',
        email: 'nandish@example.com',
        password: 'Nnadi@2005'
      });
      console.log('✅ User created');
    } catch (regError) {
      console.log('ℹ️  User might already exist, continuing...');
    }
    
    // Now login to get token
    const loginResponse = await axios.post(`${API_BASE}/users/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    // Sample transactions
    const sampleTransactions = [
      {
        type: 'income',
        category: 'Salary',
        amount: 5000,
        note: 'Monthly salary',
        date: new Date('2025-01-15')
      },
      {
        type: 'expense',
        category: 'Food',
        amount: 250,
        note: 'Groceries',
        date: new Date('2025-01-16')
      },
      {
        type: 'expense',
        category: 'Transportation',
        amount: 50,
        note: 'Bus fare',
        date: new Date('2025-01-17')
      },
      {
        type: 'income',
        category: 'Freelance',
        amount: 800,
        note: 'Website project',
        date: new Date('2025-01-18')
      },
      {
        type: 'expense',
        category: 'Entertainment',
        amount: 120,
        note: 'Movie tickets',
        date: new Date('2025-01-19')
      },
      {
        type: 'expense',
        category: 'Food',
        amount: 80,
        note: 'Restaurant dinner',
        date: new Date('2025-01-20')
      },
      {
        type: 'income',
        category: 'Gift',
        amount: 200,
        note: 'Birthday gift',
        date: new Date('2025-01-21')
      },
      {
        type: 'expense',
        category: 'Shopping',
        amount: 300,
        note: 'Clothes',
        date: new Date('2025-01-22')
      }
    ];
    
    // Create transactions
    for (const transaction of sampleTransactions) {
      try {
        await axios.post(`${API_BASE}/transactions`, transaction, { headers });
        console.log(`✅ Created ${transaction.type}: ${transaction.category} - $${transaction.amount}`);
      } catch (error) {
        console.log(`⚠️  Skipped ${transaction.type}: ${transaction.category} (might already exist)`);
      }
    }
    
    console.log('\n🎉 Sample data creation completed!');
    console.log('💡 You can now see transactions in the dashboard');
    
  } catch (error) {
    console.error('❌ Failed to create sample data:', error.response?.data || error.message);
  }
}

createSampleData();
