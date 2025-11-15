import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    company_name: 'Unison Tour',
    company_description: 'Discover sustainable travel experiences that connect you with nature while preserving our planet for future generations.',
    address: '123 Nature Way, Green City',
    phone: '+1 (555) 123-4567',
    email: 'info@ecotravel.com',
    twitter_url: '',
    instagram_url: '',
    linkedin_url: '',
    facebook_url: '',
    youtube_url: '',
    tiktok_url: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await window.apiClient.get('/api/app-settings');
      if (response.data) {
        setSettings(prev => ({
          company_name: response.data.company_name || prev.company_name,
          company_description: response.data.company_description || prev.company_description,
          address: response.data.address || prev.address,
          phone: response.data.phone || prev.phone,
          email: response.data.email || prev.email,
          twitter_url: response.data.twitter_url || '',
          instagram_url: response.data.instagram_url || '',
          linkedin_url: response.data.linkedin_url || '',
          facebook_url: response.data.facebook_url || '',
          youtube_url: response.data.youtube_url || '',
          tiktok_url: response.data.tiktok_url || '',
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Keep default values on error
    }
  };

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    // Scroll to top first
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    // Then navigate after a short delay
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const handleAnchorClick = (e, anchorId) => {
    e.preventDefault();
    // Always scroll to top first
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first
      navigate('/');
      // Wait for navigation, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 600);
    } else {
      // If on home page, scroll to top first, then to section
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 400);
    }
  };

  return (
   <>
         <section className="py-16 bg-gradient-to-br from-green-600 to-blue-600 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Your Next Adventure?</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Join thousands of eco-conscious travelers exploring the world sustainably. 
              Plan your next adventure with us today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                Contact an Expert
              </Link>
              <Link to="/signup" className="border-2 border-white hover:border-gray-200 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-lg flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer - Enhanced Green Footer with Admin Login */}
      <footer className="bg-green-600 text-white relative">
        {/* Top decorative wave */}
        <div className="absolute top-0 left-0 right-0 w-full" style={{ height: '30px', transform: 'translateY(-100%)' }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', width: '100%', height: '30px' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#16a34a" opacity="1"></path>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Column 1 - Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-green-300 text-3xl">🌿</span>
                <h3 className="text-2xl font-bold ml-2">{settings.company_name}</h3>
              </div>
              <p className="mb-5 text-green-50">{settings.company_description}</p>
              <div className="flex space-x-4">
                {settings.twitter_url && (
                  <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </a>
                )}
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                    </svg>
                  </a>
                )}
                {settings.linkedin_url && (
                  <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </a>
                )}
                {settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                    </svg>
                  </a>
                )}
                {settings.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                    </svg>
                  </a>
                )}
                {settings.tiktok_url && (
                  <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                    </svg>
                  </a>
                )}
              </div>
            </div>
            
            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-5 border-b border-green-500 pb-2">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="hover:text-green-200 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" onClick={(e) => handleLinkClick(e, '/about')} className="hover:text-green-200 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    About
                  </a>
                </li>
                <li>
                  <a href="#destinations" onClick={(e) => handleAnchorClick(e, 'destinations')} className="hover:text-green-200 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Destinations
                  </a>
                </li>
                <li>
                  <a href="/trips" onClick={(e) => handleLinkClick(e, '/trips')} className="hover:text-green-200 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    Trips
                  </a>
                </li>
                <li>
                  <a href="#reviews" onClick={(e) => handleAnchorClick(e, 'reviews')} className="hover:text-green-200 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                    Reviews
                  </a>
                </li>
                <li>
                  <a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="hover:text-green-200 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Column 3 - Contact */}
            <div>
              <h3 className="text-xl font-bold mb-5 border-b border-green-500 pb-2">Contact Us</h3>
              <div className="space-y-4">
                {settings.address && (
                  <p className="flex items-start">
                    <span className="bg-green-700 p-2 rounded-full mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </span>
                    <span>{settings.address}</span>
                  </p>
                )}
                {settings.phone && (
                  <p className="flex items-start">
                    <span className="bg-green-700 p-2 rounded-full mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </span>
                    <span>{settings.phone}</span>
                  </p>
                )}
                {settings.email && (
                  <p className="flex items-start">
                    <span className="bg-green-700 p-2 rounded-full mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </span>
                    <a href={`mailto:${settings.email}`} className="hover:text-green-200 transition-colors">{settings.email}</a>
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer Bottom - Copyright and Admin Login */}
          <div className="border-t border-green-500 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm mb-4 sm:mb-0">© 2025 Unison Tour. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy-policy" className="hover:text-green-200 transition-colors">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-green-200 transition-colors">Terms of Service</Link>
              <a href="/admin/login" className="hover:text-green-200 transition-colors font-medium bg-green-700 px-3 py-1 rounded-md">Admin Login</a>
            </div>
          </div>
        </div>
      </footer>
   </>
  );
} 