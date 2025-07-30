import React, { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <nav className="hidden md:flex space-x-8">
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
              <a 
                href="#home" 
                className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium"
              >
                Home
              </a>
              <a 
                href="#destinations" 
                className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium"
              >
                Destinations
              </a>
              <a 
                href="#trips" 
                className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium"
              >
                Trips
              </a>
              <a 
                href="#reviews" 
                className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium"
              >
                Reviews
              </a>
              <a 
                href="#about" 
                className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium"
              >
                About
              </a>
              <a 
                href="#contact" 
                className="text-green-700 hover:text-green-500 block px-3 py-2 rounded-md text-base font-medium"
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 