import React, { useState, useEffect } from 'react';

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/countries');
      if (response.ok) {
        const data = await response.json();
        setCountries(data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Destinations
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Explore the world's most beautiful countries and plan your next adventure
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-green-50 transition-colors duration-300">
              Start Exploring
            </button>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section id="countries" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Explore Countries
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover amazing destinations around the world. Click on any country to learn more about its unique attractions and experiences.
            </p>
          </div>

          {/* Countries Cards Container */}
          <div className="relative">
            {/* Scroll Container */}
            <div className="flex overflow-x-auto scrollbar-hide pb-4 space-x-6">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))
              ) : countries.length > 0 ? (
                // Countries cards
                countries.map((country) => (
                  <div key={country.id} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                    <div className="relative overflow-hidden rounded-t-lg">
                      {country.cover_image ? (
                        <img 
                          src={`/uploads/countries/${country.cover_image}`} 
                          alt={country.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                          <span className="text-white text-4xl font-bold">{country.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                        {country.name}
                      </h3>
                      {country.description && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {country.description}
                        </p>
                      )}
                      
                      {country.lat && country.lng && (
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>Location available</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // No countries message
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🌍</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Countries Available</h3>
                  <p className="text-gray-500">Countries will appear here once they are added to the system.</p>
                </div>
              )}
            </div>

            {/* Scroll Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose EcoTravel?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best travel experiences with sustainable tourism practices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">Sustainable travel practices that protect our planet.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Guides</h3>
              <p className="text-gray-600">Local experts who know the best hidden gems.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium Experience</h3>
              <p className="text-gray-600">Luxury accommodations and unforgettable memories.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 