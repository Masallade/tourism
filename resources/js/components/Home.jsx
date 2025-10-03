  // Map theme names to direct network image URLs
  const themeImages = {
    adventure: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    cultural: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
    culture: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
    nature: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    wellness: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    family: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
    luxury: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80',
    wildlife: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80',
    'wildlife': 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80',
    'wild life': 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80',
    mountain: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    desert: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80',
    city: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
    food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  'foodculinary': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    'food&culinary': 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80',
  photography: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80',
    volunteering: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80',
    historical: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
    jango: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'testtheme': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    romantic: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80',
    // Add more theme-image pairs as needed
  };
import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';


export default function Home() {
  const [countries, setCountries] = useState([]);
  // Map country names to direct network image URLs (flag or landmark)
  const countryFlagImages = {
    Pakistan: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg',
    Turkey: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg',
    Egypt: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg',
    Brazil: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg',
    France: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg',
    Germany: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg',
    Italy: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg',
    Spain: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg',
    China: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    India: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg',
    UnitedArabEmirates: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_United_Arab_Emirates.svg',
    SaudiArabia: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg',
    UnitedStates: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg',
    UnitedKingdom: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg',
    Australia: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Australia.svg',
    Canada: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg',
    Thailand: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg',
    Japan: 'https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg',
    Kenya: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Kenya.svg',
    USA: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg',
    // Add more as needed
  };
  const [serviceTypes, setServiceTypes] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('');
  const [searchMode, setSearchMode] = useState(false); // true = exact match mode

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    fetchCountries();
    fetchServiceTypes();
    fetchThemes();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/countries');
      if (response.ok) {
        const data = await response.json();
        
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
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await fetch('/api/service-types');
      if (response.ok) {
        const data = await response.json();
        setServiceTypes(data);
      }
    } catch (error) {
      console.error('Error fetching service types:', error);
    }
  };

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/themes');
      if (response.ok) {
        const data = await response.json();
        setThemes(data);
      }
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
            {/* Search Bar - Enhanced */}
            <form
              className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8 mt-8 max-w-4xl mx-auto"
              onSubmit={e => {
                e.preventDefault();
                setSubmittedTerm(searchTerm);
                setSearchMode(true);
                setTimeout(() => {
                  const el = document.getElementById('search-results-anchor');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
            >
              <div className="relative w-full md:w-3/4">
                <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-green-500">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setSearchMode(false);
                  }}
                  placeholder="Where would you like to explore?"
                  className="w-full pl-14 pr-4 py-5 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-green-300/40 shadow-xl border border-white/40 bg-white/90 backdrop-blur-sm transition-all duration-300"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setSubmittedTerm(searchTerm);
                      setSearchMode(true);
                      setTimeout(() => {
                        const el = document.getElementById('search-results-anchor');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }
                  }}
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-5 rounded-full font-semibold hover:from-green-600 hover:to-blue-600 transition shadow-xl text-lg flex items-center"
              >
                <span>Search</span>
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </form>
            
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
            
            {/* Service Types Scrollable Bar with Arrows - Enhanced */}
            <div className="w-full flex justify-center mt-12">
              <div className="relative max-w-4xl w-full">
                <button
                  className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm border border-white/30 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                  onClick={() => {
                    document.getElementById('serviceTypeScroll').scrollBy({ left: -200, behavior: 'smooth' });
                  }}
                  aria-label="Scroll left"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" className="text-green-700" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                </button>
                <div id="serviceTypeScroll" className="flex overflow-x-auto gap-3 px-3 py-3 scrollbar-hide rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/30" style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
                  {serviceTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setActiveType(type.id)}
                      className={`flex items-center px-5 py-2 rounded-full transition-all duration-300 focus:outline-none whitespace-nowrap shadow-md ${activeType === type.id ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium scale-105' : 'bg-white/80 text-gray-800 hover:bg-white'}`}
                    >
                      <span className="text-base">{type.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm border border-white/30 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                  onClick={() => {
                    document.getElementById('serviceTypeScroll').scrollBy({ left: 200, behavior: 'smooth' });
                  }}
                  aria-label="Scroll right"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" className="text-green-700" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
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

  {/* Anchor for search scroll animation */}
  <div id="search-results-anchor"></div>
  
  {/* Countries Section - Enhanced with curved separator */}
  <section id="countries" className="py-16 relative">
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
              (searchMode
                ? countries.filter(country =>
                    submittedTerm.trim() === '' ||
                    country.name.toLowerCase() === submittedTerm.toLowerCase() ||
                    (country.description && country.description.toLowerCase() === submittedTerm.toLowerCase())
                  )
                : countries.filter(country =>
                    searchTerm.trim() === '' ||
                    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (country.description && country.description.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
              ).map((country, idx) => (
                <Link 
                  to={`/country/${country.id}`} 
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
                    {countryFlagImages[country.name.replace(/\s/g, '')] ? (
                      <img 
                        src={countryFlagImages[country.name.replace(/\s/g, '')]}
                        alt={country.name + ' flag'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : country.image_url ? (
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



        {countries.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto">
              <span>View All Countries</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
          </div>
        )}
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
                (searchMode
                  ? themes.filter(theme =>
                      submittedTerm.trim() === '' ||
                      theme.name.toLowerCase() === submittedTerm.toLowerCase() ||
                      (theme.description && theme.description.toLowerCase() === submittedTerm.toLowerCase())
                    )
                  : themes.filter(theme =>
                      searchTerm.trim() === '' ||
                      theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (theme.description && theme.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                ).map((theme, idx) => (
                  <Link
                    to={`/theme/${theme.id}`}
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
                      {(() => {
                        const normalized = theme.name?.toLowerCase().replace(/\s|&/g, '');
                        const imgUrl = themeImages[normalized];
                        return imgUrl ? (
                          <img 
                            src={imgUrl}
                            alt={theme.name}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-400"></div>
                        );
                      })()}
                      
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
          

          
          {themes.length > 0 && (
            <div className="text-center mt-16">
              <button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto">
                <span>Explore All Themes</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
            </div>
          )}
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
                Why Choose EcoTravel?
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 transform -translate-y-1 rounded-full"></div>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're committed to sustainable tourism that benefits local communities while providing 
              unforgettable experiences for our travelers. Discover the EcoTravel difference.
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
                  "EcoTravel provided us with the perfect balance of adventure and sustainability. Our guide was knowledgeable and passionate, showing us hidden gems while teaching us about conservation efforts. It was the most meaningful travel experience we've ever had!"
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
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
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
                "From the moment we arrived, it was clear that EcoTravel values sustainability. We enjoyed amazing food, cultural experiences, and made a positive impact on the places we visited."
              </p>
              <p className="text-sm text-gray-500">Traveled to Costa Rica, June 2025</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
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
              <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                Contact an Expert
              </button>
              <button className="border-2 border-white hover:border-gray-200 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-lg flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Account
              </button>
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
                <h3 className="text-2xl font-bold ml-2">EcoTravel</h3>
              </div>
              <p className="mb-5 text-green-50">Discover sustainable travel experiences that connect you with nature while preserving our planet for future generations.</p>
              <div className="flex space-x-4">
                <a href="#" className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
                <a href="#" className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-5 border-b border-green-500 pb-2">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-green-200 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Home
                </a></li>
                <li><a href="#" className="hover:text-green-200 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  About Us
                </a></li>
                <li><a href="#" className="hover:text-green-200 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Destinations
                </a></li>
                <li><a href="#" className="hover:text-green-200 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Trips
                </a></li>
                <li><a href="#" className="hover:text-green-200 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Reviews
                </a></li>
                <li><a href="#" className="hover:text-green-200 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Contact
                </a></li>
              </ul>
            </div>
            
            {/* Column 3 - Contact */}
            <div>
              <h3 className="text-xl font-bold mb-5 border-b border-green-500 pb-2">Contact Us</h3>
              <div className="space-y-4">
                <p className="flex items-start">
                  <span className="bg-green-700 p-2 rounded-full mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </span>
                  <span>123 Nature Way, Green City</span>
                </p>
                <p className="flex items-start">
                  <span className="bg-green-700 p-2 rounded-full mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </span>
                  <span>+1 (555) 123-4567</span>
                </p>
                <p className="flex items-start">
                  <span className="bg-green-700 p-2 rounded-full mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </span>
                  <span>info@ecotravel.com</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer Bottom - Copyright and Admin Login */}
          <div className="border-t border-green-500 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm mb-4 sm:mb-0">© 2025 EcoTravel. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-green-200 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-green-200 transition-colors">Terms of Service</a>
              <a href="/admin/login" className="hover:text-green-200 transition-colors font-medium bg-green-700 px-3 py-1 rounded-md">Admin Login</a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}