
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ServiceProviderForm from './admin/ServiceProviderForm';
import ServiceProviderLogin from './ServiceProviderLogin';
import LanguageSwitcher from './LanguageSwitcher';
import auth from '../utils/auth';



export default function Header({ onProviderLogin, provider }) {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Header: Checking authentication...');
      
      // Check for Google login success in URL parameters or session data
      const urlParams = new URLSearchParams(window.location.search);
      const googleSuccess = urlParams.get('google_login_success');
      
      if (googleSuccess === 'true' || auth.isAuthenticated()) {
        console.log('Header: User appears to be authenticated, initializing session...');
        const isValid = await auth.initializeSession();
        if (isValid) {
          const userData = auth.getUser();
          console.log('Header: Session valid, user data:', userData);
          setUser(userData);
          setIsUserLoggedIn(true);
        } else {
          console.log('Header: Session invalid');
        }
      } else {
        console.log('Header: User not authenticated');
      }
    };
    checkAuth();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleJoinClick = () => {
    if (provider) {
      navigate('/provider/dashboard');
      return;
    }
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const handleSignUp = () => {
    setShowDialog(false);
    setShowProviderForm(true);
  };

  const handleSignIn = () => {
    setShowDialog(false);
    setShowLogin(true);
  };

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handleLoginBack = () => {
    setShowLogin(false);
    setShowDialog(true);
  };

  const handleProviderFormClose = () => {
    setShowProviderForm(false);
  };

  const handleProviderFormSuccess = () => {
    setShowProviderForm(false);
    setSuccessMessage('🎉 Your service provider application has been submitted successfully! Our admin team will review your information and approve your account within 24-48 hours. You will receive an email notification once approved.');
    
    // Auto-dismiss success message after 10 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 10000);
  };

  const handleProviderFormBack = () => {
    setShowProviderForm(false);
    setShowDialog(true);
  };

  const handleUserLogout = async () => {
    await auth.logout();
    setUser(null);
    setIsUserLoggedIn(false);
  };

  // Refresh authentication state
  const refreshAuth = async () => {
    console.log('Header: Refreshing authentication...');
    if (auth.isAuthenticated()) {
      const isValid = await auth.initializeSession();
      if (isValid) {
        const userData = auth.getUser();
        console.log('Header: Session refreshed, user data:', userData);
        setUser(userData);
        setIsUserLoggedIn(true);
      } else {
        console.log('Header: Session refresh failed');
        setUser(null);
        setIsUserLoggedIn(false);
      }
    } else {
      console.log('Header: No authentication found on refresh');
      setUser(null);
      setIsUserLoggedIn(false);
    }
  };

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Header: Storage changed, refreshing auth...');
      refreshAuth();
    };

    const handleGoogleLoginSuccess = (event) => {
      console.log('Header: Google login success event received:', event.detail);
      const userData = event.detail;
      setUser(userData);
      setIsUserLoggedIn(true);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('googleLoginSuccess', handleGoogleLoginSuccess);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('googleLoginSuccess', handleGoogleLoginSuccess);
    };
  }, []);



  return (
    <>
      {/* Dialogs rendered at root level for proper overlay and centering */}
      {showDialog && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white/95 rounded-2xl shadow-2xl px-8 py-10 w-full max-w-md mx-auto flex flex-col items-center transform transition-all">
            <h2 className="text-2xl font-extrabold mb-6 text-green-700 tracking-tight text-center">Join as a Service Provider</h2>
            <div className="flex flex-col space-y-4 w-full">
              <button
                onClick={handleSignIn}
                className="w-full px-6 py-3 bg-gray-100 text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 shadow transition"
              >
                Sign In
              </button>
              <button
                onClick={handleSignUp}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition"
              >
                Sign Up
              </button>
            </div>
            <button
              onClick={handleDialogClose}
              className="mt-6 text-base text-gray-400 hover:text-gray-700 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-full max-w-md">
            <ServiceProviderLogin 
              onLogin={prov => { 
                if (onProviderLogin) {
                  onProviderLogin(prov);
                }
                setShowLogin(false);
              }} 
              onBack={handleLoginBack}
            />
            <button
              onClick={handleLoginClose}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 w-full text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showProviderForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-full max-w-2xl">
            <ServiceProviderForm
              provider={null}
              onClose={handleProviderFormClose}
              onSuccess={handleProviderFormSuccess}
              showApproveCheckbox={false}
              onBack={handleProviderFormBack}
            />
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-green-50 border border-green-200 rounded-xl shadow-lg p-4 animate-slide-in">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setSuccessMessage('')}
                  className="text-green-400 hover:text-green-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
      
      <header className="backdrop-blur-md bg-white/90 shadow-lg border-b border-green-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
                <h1 className="text-3xl font-extrabold text-green-700 tracking-tight flex items-center gap-2 cursor-pointer hover:text-green-600 transition-all duration-300 hover:scale-105">
                <span className="text-green-500 text-4xl animate-pulse">🌿</span> 
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Unison Tour
                </span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-1">
            <Link 
              to="/destinations" 
                className="text-green-700 hover:text-green-500 font-medium transition-all duration-200 px-4 py-2 rounded-lg text-sm hover:bg-green-50 hover:shadow-sm"
            >
              {t('destinations')}
            </Link>
            <Link 
              to="/trips" 
                className="text-green-700 hover:text-green-500 font-medium transition-all duration-200 px-4 py-2 rounded-lg text-sm hover:bg-green-50 hover:shadow-sm"
            >
              {t('trips')}
            </Link>
            <a 
              href="#reviews" 
                className="text-green-700 hover:text-green-500 font-medium transition-all duration-200 px-4 py-2 rounded-lg text-sm hover:bg-green-50 hover:shadow-sm"
            >
              {t('reviews')}
            </a>
            <Link 
              to="/about" 
                className="text-green-700 hover:text-green-500 font-medium transition-all duration-200 px-4 py-2 rounded-lg text-sm hover:bg-green-50 hover:shadow-sm"
            >
              {t('about')}
            </Link>
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* AI Assistance Button */}
            <Link 
              to="/ai-assistance" 
              className="flex items-center text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-bold transition-all duration-200 px-4 py-2 rounded-xl text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {t('ai_assistance')}
            </Link>
            
            {/* Service Provider Button */}
            <button
              onClick={handleJoinClick}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
            >
              {provider ? t('provider_dashboard') : t('join_as_provider')}
            </button>
            
            {/* User Authentication Section */}
            {isUserLoggedIn ? (
              <div className="flex items-center">
                {/* User Profile Dropdown - Compact Version */}
                <div className="relative group">
                  <button className="flex items-center text-green-700 hover:text-green-500 transition-all duration-200 hover:bg-green-50 p-2 rounded-full">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-green-200 hover:ring-green-300 transition-all duration-200">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-green-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 backdrop-blur-sm">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-800">{user?.name}</p>
                          <p className="text-xs text-green-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        to="/bookings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Bookings
                      </Link>
                      <Link
                        to="/favorites"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Favorites
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleUserLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-green-700 hover:text-green-500 font-medium transition-all duration-200 hover:bg-green-50 rounded-lg"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-green-700 hover:text-green-500 focus:outline-none focus:text-green-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-4 pt-2 pb-3 space-y-1 bg-green-50 rounded-lg mt-2">
              {/* Navigation Links */}
              <Link to="/destinations" className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium">Destinations</Link>
              <Link to="/trips" className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium">Trips</Link>
              <a href="#reviews" className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium">Reviews</a>
              <Link to="/about" className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium">About</Link>
              
              {/* Language Switcher - Mobile */}
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
              
              {/* AI Assistance */}
              <Link to="/ai-assistance" className="flex items-center bg-gradient-to-r from-green-400 to-blue-400 text-white px-3 py-2 rounded-md text-base font-bold shadow-md">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Assistance
              </Link>
              
              {/* Mobile User Authentication */}
              {isUserLoggedIn ? (
                <div className="mt-4 space-y-2 border-t border-green-200 pt-4">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-green-700 font-medium">{user?.name}</span>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 text-green-700 hover:text-green-500 font-medium transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  
                  <Link
                    to="/bookings"
                    className="flex items-center px-3 py-2 text-green-700 hover:text-green-500 font-medium transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Bookings
                  </Link>
                  
                  <Link
                    to="/favorites"
                    className="flex items-center px-3 py-2 text-green-700 hover:text-green-500 font-medium transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Favorites
                  </Link>
                  
                  <button
                    onClick={handleUserLogout}
                    className="flex items-center w-full px-3 py-2 text-red-600 hover:text-red-500 font-medium transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-2 border-t border-green-200 pt-4">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 text-green-700 hover:text-green-500 font-medium transition-colors duration-200 text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full px-4 py-2 bg-green-600 text-white rounded-md font-semibold text-base hover:bg-green-700 transition-colors duration-200 text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              {/* Service Provider Button */}
              <button
                onClick={handleJoinClick}
                className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-md font-semibold text-base hover:from-green-600 hover:to-blue-600 transition-colors duration-200"
              >
                {provider ? 'Go to Provider Dashboard' : 'Join as a Service Provider'}
              </button>
            </div>
          </div>
        )}
        </div>
      </header>
    </>
  );
} 