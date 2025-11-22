import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Analytics from './components/Analytics';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  console.log('ProtectedRoute check:', { isAuthenticated, loading, hasUser: !!user });
  
  if (loading) {
    console.log('ProtectedRoute: showing loading...');
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('ProtectedRoute: not authenticated, redirecting to login...');
    return <Navigate to="/login" replace />;
  }
  
  console.log('ProtectedRoute: authenticated, showing protected content...');
  return children;
};

// Main App Component
const AppContent = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

// Root App Component
const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;