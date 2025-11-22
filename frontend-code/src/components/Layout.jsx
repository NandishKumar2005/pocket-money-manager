// import { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { useTheme } from '../contexts/ThemeContext';
// import { Link, useLocation } from 'react-router-dom';
// import { 
//   Home, 
//   CreditCard, 
//   BarChart3, 
//   LogOut, 
//   Menu, 
//   X,
//   User,
//   Wallet
// } from 'lucide-react';
// import ThemeToggle from './ThemeToggle';

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const { isDark } = useTheme();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const navigation = [
//     { name: 'Dashboard', href: '/', icon: Home },
//     { name: 'Transactions', href: '/transactions', icon: CreditCard },
//     { name: 'Analytics', href: '/analytics', icon: BarChart3 },
//   ];

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="min-h-screen bg-primary flex">
//       {/* Mobile sidebar backdrop */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div className={`
//         fixed inset-y-0 left-0 z-50 w-64 bg-secondary border-r border-color
//         transform transition-transform duration-300 ease-in-out
//         lg:translate-x-0 lg:static lg:inset-0
//         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//       `}>
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="flex items-center justify-between p-6 border-b border-color">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-accent-primary rounded-lg">
//                 <Wallet className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-primary">Pocket Money</h1>
//                 <p className="text-sm text-secondary">Manager</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="lg:hidden p-2 hover:bg-tertiary rounded-md transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-4 py-6 space-y-2">
//             {navigation.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   onClick={() => setSidebarOpen(false)}
//                   className={`
//                     flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
//                     transition-all duration-200 group
//                     ${isActive(item.href)
//                       ? 'bg-accent-primary text-white shadow-md'
//                       : 'text-secondary hover:bg-tertiary hover:text-primary'
//                     }
//                   `}
//                 >
//                   <Icon className="w-5 h-5" />
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* User section */}
//           <div className="p-4 border-t border-color">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center">
//                 <User className="w-5 h-5 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-primary truncate">
//                   {user?.name || 'User'}
//                 </p>
//                 <p className="text-xs text-secondary truncate">
//                   {user?.email || 'user@example.com'}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <ThemeToggle />
//               <button
//                 onClick={logout}
//                 className="flex-1 btn btn-secondary btn-sm"
//               >
//                 <LogOut className="w-4 h-4" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Mobile header */}
//         <div className="lg:hidden flex items-center justify-between p-4 bg-secondary border-b border-color">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="p-2 hover:bg-tertiary rounded-md transition-colors"
//           >
//             <Menu className="w-6 h-6" />
//           </button>
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-accent-primary rounded-lg">
//               <Wallet className="w-6 h-6 text-white" />
//             </div>
//             <h1 className="text-lg font-bold text-primary">Pocket Money</h1>
//           </div>
//           <ThemeToggle />
//         </div>

//         {/* Page content */}
//         <main className="flex-1 p-6 bg-primary">
//           <div className="animate-fade-in">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import React, { useContext, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // Fixed import path
import { ThemeContext } from '../contexts/ThemeContext.jsx'; // Fixed import path
import ThemeToggle from './ThemeToggle.jsx'; // Fixed import path
import Chatbot from './chatbot.jsx'; // Fixed import path

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    console.log('Layout rendering, current path:', location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  to="/"
                  className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                >
                  PocketMoney
                </Link>
              </div>
              <div className="flex items-center">
                {user ? (
                  <>
                    <div className="hidden sm:block sm:ml-6">
                      <div className="flex space-x-4">
                        <Link
                          to="/"
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/transactions"
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Transactions
                        </Link>
                        <Link
                          to="/analytics"
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Analytics
                        </Link>
                      </div>
                    </div>
                    <ThemeToggle />
                    <button
                      onClick={handleLogout}
                      className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transform transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <ThemeToggle />
                    <Link
                      to="/login"
                      className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>

        {/* Render Chatbot if user is logged in */}
        {user && <Chatbot />}

        <footer className="bg-white dark:bg-gray-800 shadow-inner mt-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Pocket Money Manager. All rights
            reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;