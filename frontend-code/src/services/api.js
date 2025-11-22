import axios from 'axios';

// API Base URL - resolve based on environment
const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:4000/api';
    }

    if (hostname.endsWith('vercel.app')) {
      return 'https://pocket-money-server.vercel.app/api';
    }

    return `${origin.replace(/\/$/, '')}/api`;
  }

  return 'http://localhost:4000/api';
};

const API_BASE_URL = resolveApiBaseUrl();

if (typeof window !== 'undefined') {
  console.log('🔧 API Configuration:', {
    hostname: window.location.hostname,
    API_BASE_URL,
    currentLocation: window.location.href,
    environment: import.meta.env.MODE
  });

  // Test API connectivity on load (browser only)
  const testAPIConnection = async () => {
    try {
      const rootUrl = API_BASE_URL.replace(/\/api$/, '/');
      const response = await fetch(rootUrl, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Connection Test Successful:', data);
      } else {
        console.error('❌ API Connection Test Failed:', response.status);
      }
    } catch (error) {
      console.error('❌ API Connection Test Error:', error.message);
      console.log('💡 Possible solutions:');
      console.log('  1. Check if backend server is running or accessible');
      console.log('  2. Verify the configured API base URL');
      console.log('  3. Check browser console for CORS errors');
    }
  };

  testAPIConnection();
}

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

export const getTransactions = async () => {
  const { data } = await transactionsAPI.getAll();
  return data;
};

export const addTransaction = async (transaction) => {
  const { data } = await transactionsAPI.create(transaction);
  return data;
};

export const updateTransaction = async (id, transaction) => {
  const { data } = await transactionsAPI.update(id, transaction);
  return data;
};

export const deleteTransaction = async (id) => {
  const { data } = await transactionsAPI.delete(id);
  return data;
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
