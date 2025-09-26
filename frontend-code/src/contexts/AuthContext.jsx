import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pocket-money-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  
  // Debug authentication state
  useEffect(() => {
    console.log('Auth state changed:', { 
      user: user ? { id: user._id, name: user.name, email: user.email } : null,
      isAuthenticated: !!user,
      loading 
    });
  }, [user, loading]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', { email });
      const response = await authAPI.login(email, password);
      console.log('Login response:', response.data);
      const { token, ...userData } = response.data;
      
      localStorage.setItem('pocket-money-token', token);
      localStorage.setItem('pocket-money-user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      console.log('Attempting registration with:', { name, email });
      const response = await authAPI.register(name, email, password);
      console.log('Registration response:', response.data);
      const { token, ...userData } = response.data;
      
      localStorage.setItem('pocket-money-token', token);
      localStorage.setItem('pocket-money-user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('pocket-money-token');
    localStorage.removeItem('pocket-money-user');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('pocket-money-user', JSON.stringify(userData));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
