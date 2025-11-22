import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff, Mail, Lock, User, Wallet } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to dashboard...');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Form submission started:', { 
      isLogin, 
      formData: { 
        name: formData.name, 
        email: formData.email, 
        passwordLength: formData.password.length 
      } 
    });

    try {
      let result;
      if (isLogin) {
        console.log('Calling login function...');
        result = await login(formData.email, formData.password);
      } else {
        console.log('Calling register function...');
        result = await register(formData.name, formData.email, formData.password);
      }

      console.log('Auth result:', result);

      if (result.success) {
        console.log('Success! Navigating to dashboard...');
        navigate('/');
      } else {
        console.log('Auth failed:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('Unexpected error in handleSubmit:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-primary rounded-2xl mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Pocket Money</h1>
          <p className="text-secondary">Manage your finances with ease</p>
        </div>

        {/* Form Card */}
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-secondary">
              {isLogin ? 'Sign in to your account' : 'Get started with Pocket Money'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-accent-danger bg-opacity-10 border border-accent-danger rounded-lg text-accent-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary btn-lg transform transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="spinner" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-secondary">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={toggleMode}
                className="ml-2 text-accent-primary hover:text-accent-secondary font-medium transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-tertiary rounded-lg">
          <h3 className="text-sm font-medium text-primary mb-2">Demo Credentials</h3>
          <p className="text-xs text-secondary mb-1">Email: test@example.com</p>
          <p className="text-xs text-secondary">Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
