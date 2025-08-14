import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Plus, 
  LogOut, 
  User,
  FormInput
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <FormInput className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-200">
                  FormBuilder
                </span>
              </Link>
            </div>
            
            {user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 border border-transparent hover:border-blue-200'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Forms
                </Link>
                <Link
                  to="/forms/new"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive('/forms/new')
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/80 border border-transparent hover:border-purple-200'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Create Form
                </Link>
              </div>
            )}
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/80 backdrop-blur-sm rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">{user.email}</span>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="relative flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <LogOut className="w-4 h-4" />
                      {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border border-transparent hover:border-gray-200 hover:bg-gray-50/80"
                >
                  Sign in
                </Link>
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <Link
                    to="/signup"
                    className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200 border border-transparent hover:border-blue-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200/50">
          <div className="pt-2 pb-3 space-y-1 px-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 border border-transparent hover:border-blue-200'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  My Forms
                </Link>
                <Link
                  to="/forms/new"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                    isActive('/forms/new')
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/80 border border-transparent hover:border-purple-200'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Plus className="w-5 h-5" />
                  Create Form
                </Link>
                <div className="border-t border-gray-200/50 pt-4 pb-3 mt-3">
                  <div className="flex items-center gap-3 px-4 py-2 mb-3 bg-gray-50/80 rounded-xl border border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:text-red-700 hover:from-red-100 hover:to-pink-100 border border-red-200 hover:border-red-300 transition-all duration-200 disabled:opacity-50"
                  >
                    <LogOut className="w-5 h-5" />
                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 border border-transparent hover:border-blue-200 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <div className="px-2">
                  <Link
                    to="/signup"
                    className="block px-4 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-center shadow-lg transition-all duration-200 transform hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
