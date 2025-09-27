
import React, { useState } from 'react';
import ServiceProviderForm from './admin/ServiceProviderForm';
import ServiceProviderLogin from './ServiceProviderLogin';
import ServiceProviderDashboard from './ServiceProviderDashboard';



export default function Header({ setProvider }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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

  const handleSignIn = () => {
    setShowDialog(false);
    setShowLogin(true);
  };

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handleProviderFormClose = () => {
    setShowProviderForm(false);
  };



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
            <ServiceProviderLogin onLogin={prov => { setProvider(prov); setShowLogin(false); }} />
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
              onSuccess={handleProviderFormClose}
              showApproveCheckbox={false}
            />
          </div>
        </div>
      )}
      <header className="backdrop-blur bg-white/80 shadow-xl border-b-2 border-green-500/40 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-extrabold text-green-700 tracking-tight flex items-center gap-2">
                <span className="text-green-500 text-4xl">🌿</span> EcoTravel
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <a 
              href="#home" 
              className="text-green-700/90 hover:bg-green-100 hover:text-green-700 font-semibold transition px-4 py-2 rounded-xl text-base tracking-wide shadow-sm"
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
              className="ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-bold text-base shadow-lg hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
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
        </div>
      </header>
    </>
  );
} 