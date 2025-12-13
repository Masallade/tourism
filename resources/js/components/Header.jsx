
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const [countries, setCountries] = useState([]);
  const [isDestinationsDropdownOpen, setIsDestinationsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userDropdownPosition, setUserDropdownPosition] = useState({ top: 0, right: 0 });
  const userButtonRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Add padding to body for fixed header
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      const headerHeight = header.offsetHeight;
      document.body.style.paddingTop = `${headerHeight}px`;
    }
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  // Calculate user dropdown position when opened
  useEffect(() => {
    if (isUserDropdownOpen && userButtonRef.current) {
      const updatePosition = () => {
        if (userButtonRef.current) {
          const buttonRect = userButtonRef.current.getBoundingClientRect();
          setUserDropdownPosition({
            top: buttonRect.bottom + 8,
            right: window.innerWidth - buttonRect.right,
          });
        }
      };
      
      updatePosition();
      
      // Update position on scroll and resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isUserDropdownOpen]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userButtonRef.current && 
        !userButtonRef.current.contains(event.target) &&
        userDropdownRef.current && 
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('header')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

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
    // Fetch countries for destinations dropdown
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await window.apiClient.get('/api/countries');
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" style={{ zIndex: 10001 }}>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60" style={{ zIndex: 10001 }}>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60" style={{ zIndex: 10001 }}>
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
        <div className="fixed top-4 right-4 max-w-md" style={{ zIndex: 10002 }}>
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
      
      <style>{`
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
      
      <header className="backdrop-blur-md bg-white/90 shadow-lg border-b border-green-200/50 fixed top-0 left-0 right-0 z-50" style={{ zIndex: 9998 }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4 md:py-5 lg:py-6 gap-2 sm:gap-4">
          {/* Logo/Brand */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-extrabold text-green-700 tracking-tight flex items-center gap-1 sm:gap-1.5 cursor-pointer hover:text-green-600 transition-all duration-300">
                <span className="text-green-500 text-xl sm:text-2xl md:text-2xl lg:text-2xl flex-shrink-0">🌿</span> 
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent whitespace-nowrap">
                  <span className="hidden sm:inline">Unison Tour</span>
                  <span className="sm:hidden">UT</span>
                </span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3 2xl:gap-4 flex-1 justify-end min-w-0">
            {/* Main Navigation Links */}
            <div className="flex items-center gap-1 xl:gap-2 flex-shrink-0">
            {/* Destinations Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsDestinationsDropdownOpen(true)}
                onMouseLeave={() => setIsDestinationsDropdownOpen(false)}
                className="text-green-700 hover:text-green-500 font-medium transition-all duration-200 px-2 xl:px-3 py-2 rounded-lg text-sm hover:bg-green-50 hover:shadow-sm flex items-center whitespace-nowrap"
              >
                {t('destinations')}
                <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDestinationsDropdownOpen && (
                <div 
                  className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-green-100 backdrop-blur-sm z-50"
                  onMouseEnter={() => setIsDestinationsDropdownOpen(true)}
                  onMouseLeave={() => setIsDestinationsDropdownOpen(false)}
                >
                  <div className="py-2 max-h-96 overflow-y-auto">
                    {/* All Destinations */}
                    <Link 
                      to="/destinations" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                      onClick={() => setIsDestinationsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">All Destinations</span>
                    </Link>
                    
                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    {/* Countries */}
                    {countries.length > 0 ? (
                      countries.map((country) => (
                        <Link
                          key={country.id}
                          to={`/destinations?country=${country.id}`}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                          onClick={() => setIsDestinationsDropdownOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{country.name}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">Loading destinations...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link 
              to="/trips" 
              className="text-green-700 hover:text-green-500 font-medium transition-all duration-200 px-2 xl:px-3 py-2 rounded-lg text-sm hover:bg-green-50 hover:shadow-sm whitespace-nowrap"
            >
              {t('trips')}
            </Link>
            <a 
              href="#reviews" 
              className="text-green-700 hover:text-green-500 font-medium transition-all duration-200 px-2 xl:px-3 py-2 rounded-lg text-sm hover:bg-green-50 hover:shadow-sm whitespace-nowrap"
            >
              {t('reviews')}
            </a>
            <Link 
              to="/about" 
              className="text-green-700 hover:text-green-500 font-medium transition-all duration-200 px-2 xl:px-3 py-2 rounded-lg text-sm hover:bg-green-50 hover:shadow-sm whitespace-nowrap"
            >
              {t('about')}
            </Link>
            </div>

            {/* Language Switcher */}
            <div className="flex-shrink-0">
              <LanguageSwitcher />
            </div>

            {/* AI Assistance Button */}
            <Link 
              to="/ai-assistance" 
              className="flex items-center text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-bold transition-all duration-200 px-3 py-2 rounded-xl text-sm shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap flex-shrink-0"
            >
              <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="hidden 2xl:inline">{t('ai_assistance')}</span>
              <span className="hidden xl:inline 2xl:hidden">AI</span>
              <span className="xl:hidden">AI</span>
            </Link>
            
            {/* Service Provider Button */}
            <button
              onClick={handleJoinClick}
              className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 transform hover:scale-105 whitespace-nowrap flex-shrink-0"
            >
              <span className="hidden 2xl:inline">{provider ? t('provider_dashboard') : t('join_as_provider')}</span>
              <span className="hidden xl:inline 2xl:hidden">{provider ? t('dashboard') : t('join')}</span>
              <span className="xl:hidden">{provider ? t('dashboard') : t('join')}</span>
            </button>
            
            {/* User Authentication Section */}
            {isUserLoggedIn ? (
              <div className="flex items-center flex-shrink-0">
                {/* User Profile Dropdown */}
                <div className="relative">
                  <button 
                    ref={userButtonRef}
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center text-green-700 hover:text-green-500 transition-all duration-200 hover:bg-green-50 p-1.5 rounded-full"
                  >
                    <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-green-200 hover:ring-green-300 transition-all duration-200">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to="/login"
                  className="px-3 py-2 text-green-700 hover:text-green-500 font-medium transition-all duration-200 hover:bg-green-50 rounded-lg text-sm whitespace-nowrap"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 text-sm whitespace-nowrap"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Show language switcher on mobile before menu */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <button
              onClick={toggleMenu}
              className="text-green-700 hover:text-green-500 focus:outline-none focus:text-green-500 p-2 rounded-lg hover:bg-green-50 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
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
          <div className="lg:hidden border-t border-green-200/50 bg-white/95 backdrop-blur-sm">
            <div className="px-4 pt-4 pb-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
              {/* Navigation Links */}
              <div className="space-y-1">
                <div className="mb-2">
                  <Link 
                    to="/destinations" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-green-700 hover:text-green-500 block px-3 py-2.5 rounded-lg text-base font-semibold hover:bg-green-50 transition-colors"
                  >
                    {t('destinations')}
                  </Link>
                  {/* Countries in Mobile */}
                  <div className="pl-4 mt-1 space-y-1">
                    {countries.slice(0, 8).map((country) => (
                      <Link 
                        key={country.id} 
                        to={`/destinations?country=${country.id}`} 
                        onClick={() => setIsMenuOpen(false)}
                        className="text-green-600 hover:text-green-500 block px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                      >
                        {country.name}
                      </Link>
                    ))}
                    {countries.length > 8 && (
                      <Link 
                        to="/destinations" 
                        onClick={() => setIsMenuOpen(false)}
                        className="text-green-500 hover:text-green-600 block px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors"
                      >
                        View All →
                      </Link>
                    )}
                  </div>
                </div>
                <Link 
                  to="/trips" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-green-700 hover:text-green-500 block px-3 py-2.5 rounded-lg text-base font-semibold hover:bg-green-50 transition-colors"
                >
                  {t('trips')}
                </Link>
                <a 
                  href="#reviews" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-green-700 hover:text-green-500 block px-3 py-2.5 rounded-lg text-base font-semibold hover:bg-green-50 transition-colors"
                >
                  {t('reviews')}
                </a>
                <Link 
                  to="/about" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-green-700 hover:text-green-500 block px-3 py-2.5 rounded-lg text-base font-semibold hover:bg-green-50 transition-colors"
                >
                  {t('about')}
                </Link>
              </div>
              
              {/* Language Switcher - Mobile (only show if not already visible) */}
              <div className="sm:hidden px-3 py-3 border-t border-green-200 mt-3">
                <LanguageSwitcher />
              </div>
              
              {/* AI Assistance */}
              <Link 
                to="/ai-assistance" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-lg text-base font-bold shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all mt-3"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {t('ai_assistance')}
              </Link>
              
              {/* Mobile User Authentication */}
              {isUserLoggedIn ? (
                <div className="mt-3 space-y-1 border-t border-green-200 pt-3">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-green-800 font-semibold text-sm truncate">{user?.name}</p>
                      <p className="text-green-600 text-xs truncate">{user?.email}</p>
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 text-green-700 hover:text-green-500 hover:bg-green-50 font-medium transition-colors rounded-lg"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t('my_profile')}
                  </Link>
                  
                  <Link
                    to="/bookings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 text-green-700 hover:text-green-500 hover:bg-green-50 font-medium transition-colors rounded-lg"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {t('my_bookings')}
                  </Link>
                  
                  <Link
                    to="/favorites"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 text-green-700 hover:text-green-500 hover:bg-green-50 font-medium transition-colors rounded-lg"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {t('favorites')}
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleUserLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2.5 text-red-600 hover:text-red-500 hover:bg-red-50 font-medium transition-colors rounded-lg"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-2 border-t border-green-200 pt-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-2.5 text-green-700 hover:text-green-500 hover:bg-green-50 font-medium transition-colors duration-200 text-center rounded-lg"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold text-base hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-center shadow-lg"
                  >
                    {t('signup')}
                  </Link>
                </div>
              )}
              
              {/* Service Provider Button */}
              <button
                onClick={() => {
                  handleJoinClick();
                  setIsMenuOpen(false);
                }}
                className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold text-base hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg"
              >
                {provider ? t('provider_dashboard') : t('join_as_provider')}
              </button>
            </div>
          </div>
        )}
        </div>
      </header>

      {/* User Profile Dropdown - Rendered via Portal */}
      {isUserLoggedIn && isUserDropdownOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={userDropdownRef}
          className="fixed w-56 bg-white rounded-xl shadow-2xl border border-green-100" 
          style={{ 
            zIndex: 10000,
            top: `${userDropdownPosition.top}px`,
            right: `${userDropdownPosition.right}px`,
          }}
        >
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
              onClick={() => setIsUserDropdownOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </Link>
            <Link
              to="/bookings"
              onClick={() => setIsUserDropdownOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Bookings
            </Link>
            <Link
              to="/favorites"
              onClick={() => setIsUserDropdownOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Favorites
            </Link>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={() => {
                handleUserLogout();
                setIsUserDropdownOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
} 