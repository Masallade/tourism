import React, { useState } from 'react';
import ServiceProviderForm from './admin/ServiceProviderForm';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showProviderForm, setShowProviderForm] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleJoinClick = () => {
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const handleSignUp = () => {
    setShowDialog(false);
    setShowProviderForm(true);
  };

  const handleProviderFormClose = () => {
    setShowProviderForm(false);
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-green-700">
                <span className="text-green-600">🌿</span> EcoTravel
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <a 
              href="#home" 
              className="text-green-700 hover:text-green-500 font-medium transition-colors duration-200 px-3 py-2 rounded-md text-sm font-semibold"
            >
              Home
            </a>
            <a 
              href="#destinations" 
              className="text-green-700 hover:text-green-500 font-medium transition-colors duration-200 px-3 py-2 rounded-md text-sm font-semibold"
            >
              Destinations
            </a>
            <a 
              href="#trips" 
              className="text-green-700 hover:text-green-500 font-medium transition-colors duration-200 px-3 py-2 rounded-md text-sm font-semibold"
            >
              Trips
            </a>
            <a 
              href="#reviews" 
              className="text-green-700 hover:text-green-500 font-medium transition-colors duration-200 px-3 py-2 rounded-md text-sm font-semibold"
            >
              Reviews
            </a>
            <a 
              href="#about" 
              className="text-green-700 hover:text-green-500 font-medium transition-colors duration-200 px-3 py-2 rounded-md text-sm font-semibold"
            >
              About
            </a>
            <a 
              href="#contact" 
              className="text-green-700 hover:text-green-500 font-medium transition-colors duration-200 px-3 py-2 rounded-md text-sm font-semibold"
            >
              Contact
            </a>
            <button
              onClick={handleJoinClick}
              className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md font-semibold text-sm hover:bg-green-700 transition-colors duration-200"
            >
              Join as a Service Provider
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-50 rounded-lg mt-2">
              <a href="#home" className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium">Home</a>
              <a href="#destinations" className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium">Destinations</a>
              <a href="#trips" className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium">Trips</a>
              <a href="#reviews" className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium">Reviews</a>
              <a href="#about" className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium">About</a>
              <a href="#contact" className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium">Contact</a>
              <button
                onClick={handleJoinClick}
                className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-md font-semibold text-base hover:bg-green-700 transition-colors duration-200"
              >
                Join as a Service Provider
              </button>
            </div>
          </div>
        )}
      {/* Dialog for Sign In / Sign Up */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-bold mb-4 text-green-700">Join as a Service Provider</h2>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => alert('Sign In logic here')}
                className="px-4 py-2 bg-gray-100 text-green-700 rounded-md font-semibold hover:bg-gray-200"
              >
                Sign In
              </button>
              <button
                onClick={handleSignUp}
                className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
              >
                Sign Up
              </button>
            </div>
            <button
              onClick={handleDialogClose}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Service Provider Form Dialog */}
      {showProviderForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-2xl">
            <ServiceProviderForm
              provider={null}
              onClose={handleProviderFormClose}
              onSuccess={handleProviderFormClose}
            />
          </div>
        </div>
      )}
      </div>
    </header>
  );
} 