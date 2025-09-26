import axios from 'axios';

// Always use localhost for development - it's more reliable than 127.0.0.1
const API_BASE_URL = 'http://localhost:4000/api';

console.log('API Configuration:', {
  hostname: window.location.hostname,
  API_BASE_URL,
  currentLocation: window.location.href
});

// Test API connectivity on load
const testAPIConnection = async () => {
  try {
    const response = await fetch(API_BASE_URL.replace('/api', '/'));
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Connection Test Successful:', data);
    } else {
      console.error('❌ API Connection Test Failed:', response.status);
    }
  } catch (error) {
    console.error('❌ API Connection Test Error:', error.message);
    console.log('💡 Possible solutions:');
    console.log('  1. Check if backend server is running on port 4000');
    console.log('  2. Try refreshing the page');
    console.log('  3. Check browser console for CORS errors');
  }
};

// Run connection test
testAPIConnection();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pocket-money-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      hasToken: !!token
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase()
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('pocket-money-token');
      localStorage.removeItem('pocket-money-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/users/login', { email, password }),
  register: (name, email, password) => api.post('/users/register', { name, email, password }),
  getMe: () => api.get('/users/me'),
  getAllUsers: () => api.get('/users'),
};

// Transactions API
export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (transaction) => api.post('/transactions', transaction),
  update: (id, transaction) => api.patch(`/transactions/${id}`, transaction),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default api;
