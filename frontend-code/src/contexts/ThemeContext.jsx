import { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('pocket-money-theme');
      const initialTheme = savedTheme || 'light';
      
      // Apply theme immediately on initialization
      document.documentElement.setAttribute('data-theme', initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return initialTheme;
    }
    return 'light';
  });

  // Update theme when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pocket-money-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      
      // Apply dark class for Tailwind dark mode
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
