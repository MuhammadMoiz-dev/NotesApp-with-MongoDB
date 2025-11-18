import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Notebook, PenTool, Shield, CheckCircle, ArrowRight } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({children}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

  // Check if user is logged in
  const checkAuth = async () => {
    try {
      const response = await fetch(`${serverURL}/me`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(`${serverURL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUser(null);
        setIsMenuOpen(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // If still loading, show a simple navbar
  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">MyApp</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>

      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* App Name */}
            <div className="flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="ml-3">
                <Link to={isLoggedIn ? "/dashboard" : "/"}>
                  <h1 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                    MyApp
                  </h1>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation - Right side */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                      <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name || 'User'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <div className="flex items-center px-3 py-2 text-gray-700">
                      <div className="h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">{user?.name || 'User'}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className=" items-center w-full text-left text-red-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-indigo-600 text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

{children}


      <footer className="py-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-6 w-6 bg-indigo-600 rounded flex items-center justify-center">
                <Notebook className="h-4 w-4 text-white" />
              </div>
              <span className="ml-2 font-semibold">NoteApp</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 NoteApp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default NavBar;