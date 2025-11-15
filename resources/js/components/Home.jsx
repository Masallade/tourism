import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { Link, useLocation } from 'react-router-dom';
import ProvidersMap from './ProvidersMap';


export default function Home() {
  const [countries, setCountries] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if we need to scroll to a specific section
    const scrollTo = location.state?.scrollTo;
    const hash = window.location.hash;
    const elementId = scrollTo || (hash ? hash.substring(1) : null);
    
    if (elementId) {
      // Wait for content to load, then scroll
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    } else {
      // Default: scroll to top
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    fetchCountries();
    fetchThemes();
  }, [location.pathname, location.state, location.hash]);

  const fetchCountries = async () => {
    try {
      const response = await window.apiClient.get('/api/countries');
      const data = response.data;
      
      // Log countries data to check for image_url
      console.log('Countries data received:', data);
      
      // Specifically check Brazil if it exists
      const brazil = data.find(country => country.name === 'Brazil');
      if (brazil) {
        console.log('Brazil data:', {
          id: brazil.id,
          name: brazil.name,
          image_url: brazil.image_url
        });
      }
      
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchThemes = async () => {
    try {
      const response = await window.apiClient.get('/api/themes');
      const data = response.data;
      setThemes(data);
    } catch (error) {
      console.error('Error fetching themes:', error);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Gradient mask for horizontal scrolling containers */
        .mask-gradient-x {
          mask-image: linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%);
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section - Enhanced */}
      <section
        className="relative text-white py-24 md:py-32"
        style={{
          position: 'relative',
        }}
      >
        {/* Background with animated gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat`,
            opacity: 0.8,
            zIndex: 0,
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-blue-900/60"
          style={{ zIndex: 0 }}
        ></div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 relative" style={{zIndex: 1}}>
          <div className="text-center">
            <div className="mb-4 inline-block">
              <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                Eco-Friendly Travel Experiences
              </div>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200">Discover Amazing Destinations</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto text-white/90 drop-shadow">
              Explore the world's most beautiful countries and plan your next adventure with our eco-conscious travel guides
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-8 py-3 rounded-full font-medium text-lg transition flex items-center gap-2 border border-white/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Discover More
              </button>
              <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-medium text-lg hover:from-green-600 hover:to-blue-600 transition shadow-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                Plan Your Trip
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 bg-gradient-to-b from-white via-green-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">
              EXPLORE OUR NETWORK
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              <span className="relative inline-block">
                Discover Service Providers Worldwide
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 transform -translate-y-1 rounded-full"></div>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our network of verified eco-friendly service providers across the globe. 
              Click on any marker to learn more about sustainable travel opportunities in that location.
            </p>
          </div>

          {/* Map Component */}
          <ProvidersMap />
        </div>
      </section>

      {/* Featured Listings Section - Enhanced */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Featured Highlights</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">Discover our most popular destinations and experiences loved by eco-conscious travelers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-green-600/0 to-green-600/10 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="bg-white/80 backdrop-blur-sm w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-md">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Top Destinations</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <span className="bg-green-200 rounded-full p-1 mr-2">
                    <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  Bangkok - Cultural Immersion
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="bg-green-200 rounded-full p-1 mr-2">
                    <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  Phuket - Beach Paradise
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="bg-green-200 rounded-full p-1 mr-2">
                    <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  Chiang Mai - Mountain Adventure
                </li>
              </ul>
              <button className="mt-5 text-green-700 font-medium hover:text-green-800 flex items-center transition-colors">
                Explore destinations
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/0 to-blue-600/10 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="bg-white/80 backdrop-blur-sm w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-md">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Popular Stays</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <span className="bg-blue-200 rounded-full p-1 mr-2">
                    <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  Eco Resort - Sustainable Luxury
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="bg-blue-200 rounded-full p-1 mr-2">
                    <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  Green Stay - Carbon Neutral
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="bg-blue-200 rounded-full p-1 mr-2">
                    <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  Adventure Lodge - Local Experience
                </li>
              </ul>
              <button className="mt-5 text-blue-700 font-medium hover:text-blue-800 flex items-center transition-colors">
                Find accommodations
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-600/0 to-amber-600/10 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="bg-white/80 backdrop-blur-sm w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-md">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Top Experiences</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <span className="bg-amber-200 rounded-full p-1 mr-2">
                    <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  Guided Eco Tours with Locals
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="bg-amber-200 rounded-full p-1 mr-2">
                    <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  Authentic Cuisine Experiences
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="bg-amber-200 rounded-full p-1 mr-2">
                    <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  Nature Walks & Conservation
                </li>
              </ul>
              <button className="mt-5 text-amber-700 font-medium hover:text-amber-800 flex items-center transition-colors">
                Discover experiences
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

  
  {/* Countries Section - Enhanced with curved separator */}
  <section id="destinations" className="py-16 relative">
    {/* Top curved separator */}
    <div className="absolute top-0 left-0 right-0 overflow-hidden w-full" style={{ height: '50px', transform: 'translateY(-100%)' }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', width: '100%', height: '200px', bottom: 0 }}>
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F9FAFB"></path>
      </svg>
    </div>

    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 relative">
      <div className="text-center mb-12">
        <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">DISCOVER THE WORLD</span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative">
          <span className="relative inline-block">
            Explore Countries
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 transform -translate-y-1 rounded-full"></div>
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover amazing destinations around the world with our eco-friendly travel guides. 
          Each country offers unique sustainable experiences curated by local experts.
        </p>
      </div>

      {/* Countries Cards Container with Horizontal Slider */}
      <div className="relative bg-white/30 backdrop-blur-sm rounded-xl p-6">
        <div className="relative">
          {/* Left arrow button */}
          <button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-10 bg-gradient-to-r from-white to-white/80 backdrop-blur-sm rounded-full p-3.5 shadow-xl hover:shadow-2xl border border-green-100 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            onClick={() => {
              document.getElementById('countriesSlider').scrollBy({ left: -300, behavior: 'smooth' });
            }}
            aria-label="Scroll left"
          >
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          {/* Slider container */}
          <div 
            id="countriesSlider"
            className="flex overflow-x-auto pb-8 pt-4 px-2 -mx-2 space-x-8 scrollbar-hide scroll-smooth mask-gradient-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              <div className="flex justify-center items-center w-full min-h-[300px]">
                <ClipLoader color="#22c55e" size={60} speedMultiplier={0.9} />
              </div>
            ) : countries.length > 0 ? (
              // Countries cards
              countries.map((country, idx) => (
                <Link 
                  to={`/trips?country=${country.id}`} 
                  key={country.id}
                  className="flex-shrink-0 w-[300px] bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 cursor-pointer group animate-fade-in overflow-hidden"
                  style={{
                    animation: 'fadeInScale 0.5s',
                    animationDelay: `${idx * 0.05}s`,
                    animationFillMode: 'both',
                    textDecoration: 'none',
                    borderTop: '5px solid #10B981'
                  }}
                >
                  <div className="relative overflow-hidden h-56">
                    {country.image_url ? (
                      <img 
                        src={country.image_url}
                        alt={country.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center group-hover:from-green-600 group-hover:to-blue-600 transition-colors duration-300">
                        <span className="text-white text-5xl font-bold">{country.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 group-hover:to-black/70 transition-all duration-300"></div>
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Eco-Friendly
                    </div>
                  </div>
                  <div className="p-6 relative">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300 flex items-center">
                      {country.name}
                      <svg className="w-5 h-5 ml-2 text-green-500 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </h3>
                    {country.description && (
                      <p className="text-gray-600 line-clamp-2">
                        {country.description}
                      </p>
                    )}
                    <div className="flex items-center mt-4 text-sm text-gray-500">
                      <span className="flex items-center mr-4">
                        <svg className="w-4 h-4 mr-1 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        Top Rated
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Year-round
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // No countries message
              <div className="text-center py-12 w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Countries Available</h3>
                <p className="text-gray-500 max-w-md mx-auto">Countries will appear here once they are added to the system. Check back soon for exciting destinations!</p>
              </div>
            )}
          </div>
          
          {/* Right arrow button */}
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-10 bg-gradient-to-l from-white to-white/80 backdrop-blur-sm rounded-full p-3.5 shadow-xl hover:shadow-2xl border border-green-100 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            onClick={() => {
              document.getElementById('countriesSlider').scrollBy({ left: 300, behavior: 'smooth' });
            }}
            aria-label="Scroll right"
          >
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>



      </div>
    </div>
    
    {/* Bottom wave separator */}
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden w-full" style={{ height: '50px', transform: 'translateY(90%)' }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', width: '100%', height: '75px', transform: 'rotate(180deg)' }}>
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#EFF6FF" opacity="0.8"></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#EFF6FF" opacity="0.5"></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#EFF6FF"></path>
      </svg>
    </div>
  </section>

      {/* Explore Themes Section - Enhanced */}
      <section id="themes" className="py-20 relative overflow-hidden">
        {/* Wave background decoration */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
          <svg className="absolute top-0 w-full" style={{transform: 'translateY(-70%)'}} viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                  fill="#ffffff" fillOpacity="0.8"></path>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">FIND YOUR PASSION</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative">
              <span className="relative inline-block">
                Explore Themes
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-green-400 transform -translate-y-1 rounded-full"></div>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find eco-friendly experiences by interest. Whether you're seeking adventure, relaxation, or cultural immersion,
              our curated themes connect you with sustainable travel options.
            </p>
          </div>
          
          {/* Themes Cards - Horizontal Slider */}
          <div className="relative">
            {/* Left arrow button */}
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-10 bg-gradient-to-r from-white to-white/80 backdrop-blur-sm rounded-full p-3.5 shadow-xl hover:shadow-2xl border border-blue-100 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              onClick={() => {
                document.getElementById('themesSlider').scrollBy({ left: -350, behavior: 'smooth' });
              }}
              aria-label="Scroll left"
            >
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            {/* Themes Slider Container */}
            <div 
              id="themesSlider"
              className="flex overflow-x-auto pb-8 pt-4 px-2 -mx-2 space-x-8 scrollbar-hide scroll-smooth mask-gradient-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {themes.length > 0 ? (
                themes.map((theme, idx) => (
                  <Link
                    to={`/theme/${theme.slug || theme.id}`}
                    key={theme.id}
                    className="group flex-shrink-0 w-[350px]"
                    style={{
                      animation: 'fadeInScale 0.5s',
                      animationDelay: `${idx * 0.05}s`,
                      animationFillMode: 'both',
                      textDecoration: 'none'
                    }}
                  >
                    <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl border border-transparent hover:border-white/20">
                      {/* Card background with gradient overlay */}
                      {theme.image_url ? (
                          <img 
                          src={theme.image_url}
                            alt={theme.name}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-400"></div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70 group-hover:via-black/30 group-hover:to-black/80 transition-all duration-300"></div>
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start">
                        <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full mb-3 font-medium">Sustainable</div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">{theme.name}</h3>
                        {theme.description && (
                          <p className="text-white/80 text-sm line-clamp-2 mb-4 group-hover:text-white transition-colors">
                            {theme.description}
                          </p>
                        )}
                        <span className="flex items-center text-white/90 text-sm font-medium">
                          <span>Explore theme</span>
                          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </span>
                      </div>
                      
                      {/* Top right tag */}
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium">
                        <span>{idx % 3 === 0 ? 'Popular' : idx % 2 === 0 ? 'New' : 'Featured'}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-16 w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/40">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100/80 rounded-full mb-6">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Themes Available</h3>
                  <p className="text-gray-500 max-w-md mx-auto">Our team is curating amazing eco-friendly themes for your next adventure. Check back soon!</p>
                </div>
              )}
            </div>
            
            {/* Right arrow button */}
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-10 bg-gradient-to-l from-white to-white/80 backdrop-blur-sm rounded-full p-3.5 shadow-xl hover:shadow-2xl border border-blue-100 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              onClick={() => {
                document.getElementById('themesSlider').scrollBy({ left: 350, behavior: 'smooth' });
              }}
              aria-label="Scroll right"
            >
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          

          
        </div>
      </section>

      {/* Features Section - Enhanced with animation and better design */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-green-50 to-green-100 rounded-full opacity-70 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full opacity-70 blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 relative">
          <div className="text-center mb-16">
            <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">WHY CHOOSE US</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              <span className="relative inline-block">
                Why Choose Unison Tour?
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 transform -translate-y-1 rounded-full"></div>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're committed to sustainable tourism that benefits local communities while providing 
              unforgettable experiences for our travelers. Discover the Unison Tour difference.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 border-t-4 border-green-500 transform transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-400 to-green-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Eco-Friendly Travel</h3>
              <p className="text-gray-600 text-center">
                Our trips are designed with sustainability in mind, minimizing environmental impact while maximizing authentic experiences.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 border-t-4 border-blue-500 transform transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Local Expert Guides</h3>
              <p className="text-gray-600 text-center">
                Our guides are local experts who share authentic cultural insights and hidden gems you won't find in typical tourist experiences.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 border-t-4 border-amber-500 transform transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Value for Money</h3>
              <p className="text-gray-600 text-center">
                Premium experiences at fair prices, with a portion of profits reinvested in local community development projects.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 border-t-4 border-purple-500 transform transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Unforgettable Memories</h3>
              <p className="text-gray-600 text-center">
                Curated experiences designed to create lasting memories, from breathtaking landscapes to authentic cultural exchanges.
              </p>
            </div>
          </div>
          
          {/* Testimonial Banner */}
          <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 p-8 md:p-12 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/2"></div>
            
            <div className="flex flex-col md:flex-row items-center md:space-x-8 relative z-10">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 md:mb-0 flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256" alt="Happy Customer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <svg className="w-12 h-12 text-green-300/50 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-xl text-gray-700 italic mb-4">
                  "Unison Tour provided us with the perfect balance of adventure and sustainability. Our guide was knowledgeable and passionate, showing us hidden gems while teaching us about conservation efforts. It was the most meaningful travel experience we've ever had!"
                </p>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Adventure enthusiast, traveled to Costa Rica</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">TRAVELER STORIES</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              <span className="relative inline-block">
                What Our Travelers Say
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 transform -translate-y-1 rounded-full"></div>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Real experiences from eco-conscious travelers who explored the world with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6 relative">
              <div className="absolute top-6 right-6">
                <svg className="w-10 h-10 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100" alt="Customer" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">David Chen</h4>
                  <div className="flex text-amber-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-3">
                "Our trip to Thailand was incredible! The eco-friendly accommodations were beautiful, and we felt good knowing our tourism was supporting local communities."
              </p>
              <p className="text-sm text-gray-500">Traveled to Thailand, March 2025</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6 relative">
              <div className="absolute top-6 right-6">
                <svg className="w-10 h-10 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100" alt="Customer" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Maria Rodriguez</h4>
                  <div className="flex text-amber-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-3">
                "The sustainable safari experience exceeded all expectations. Our guide was knowledgeable, and the conservation efforts we participated in made this trip truly meaningful."
              </p>
              <p className="text-sm text-gray-500">Traveled to Kenya, January 2025</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6 relative">
              <div className="absolute top-6 right-6">
                <svg className="w-10 h-10 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100" alt="Customer" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">James Wilson</h4>
                  <div className="flex text-amber-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-3">
                "From the moment we arrived, it was clear that Unison Tour values sustainability. We enjoyed amazing food, cultural experiences, and made a positive impact on the places we visited."
              </p>
              <p className="text-sm text-gray-500">Traveled to Costa Rica, June 2025</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}

      </div>
    </>
  );
}