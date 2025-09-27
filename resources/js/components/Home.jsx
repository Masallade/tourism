import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';


export default function Home() {
  const [countries, setCountries] = useState([]);
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
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section
        className="relative text-white py-20"
        style={{
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat`,
            opacity: 0.45,
            zIndex: 0,
          }}
        />
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{zIndex: 1}}>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Destinations
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Explore the world's most beautiful countries and plan your next adventure
            </p>
            {/* Service Types Scrollable Bar with Arrows */}
            <div className="w-full flex justify-center">
              <div className="relative max-w-3xl w-full">
                <button
                  className="absolute left-[-32px] top-1/2 -translate-y-1/2 z-10 bg-white border border-green-300 rounded-full p-2 shadow hover:bg-green-100 transition-colors"
                  style={{ color: 'black' }}
                  onClick={() => {
                    document.getElementById('serviceTypeScroll').scrollBy({ left: -200, behavior: 'smooth' });
                  }}
                  aria-label="Scroll left"
                >
                  <svg width="24" height="24" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                </button>
                <div id="serviceTypeScroll" className="flex overflow-x-auto gap-4 px-2 py-2 scrollbar-hide rounded-lg bg-white/80 shadow-lg" style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
                  {serviceTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setActiveType(type.id)}
                      className={`flex flex-col items-center px-5 py-2 rounded-xl transition-colors duration-200 focus:outline-none whitespace-nowrap shadow-sm border ${activeType === type.id ? 'bg-green-600 text-white font-bold border-green-700' : 'bg-white text-green-700 border-green-200 hover:bg-green-100'}`}
                    >
                      <span className="text-base md:text-lg">{type.name}</span>
                      {activeType === type.id && <div className="h-1 w-8 bg-white rounded-full mt-2"></div>}
                    </button>
                  ))}
                </div>
                <button
                  className="absolute right-[-32px] top-1/2 -translate-y-1/2 z-10 bg-white border border-green-300 rounded-full p-2 shadow hover:bg-green-100 transition-colors"
                  style={{ color: 'black' }}
                  onClick={() => {
                    document.getElementById('serviceTypeScroll').scrollBy({ left: 200, behavior: 'smooth' });
                  }}
                  aria-label="Scroll right"
                >
                  <svg width="24" height="24" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
            {/* Search Bar Addition - More Stylish */}
            <form
              className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8 mt-6"
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
              <div className="relative w-full md:w-2/3">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setSearchMode(false);
                  }}
                  placeholder="Search countries, themes..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-lg border border-green-200 bg-white transition-all duration-300 focus:scale-105"
                  style={{ boxShadow: '0 4px 24px rgba(34,197,94,0.08)' }}
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
                className="bg-green-500 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-green-600 transition-colors shadow-lg"
                style={{ boxShadow: '0 4px 24px rgba(34,197,94,0.12)' }}
              >
                Search
              </button>
            </form>
            <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:scale-105 transition-transform duration-300 mt-4">
              Start Exploring
            </button>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-green-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-green-800 mb-2">Top Destinations</h2>
            <ul className="list-disc ml-6 text-green-700">
              <li>Bangkok</li>
              <li>Phuket</li>
              <li>Chiang Mai</li>
            </ul>
          </div>
          <div className="bg-blue-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">Popular Hotels</h2>
            <ul className="list-disc ml-6 text-blue-700">
              <li>Eco Resort</li>
              <li>Green Stay</li>
              <li>Adventure Lodge</li>
            </ul>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-yellow-800 mb-2">Top Experiences</h2>
            <ul className="list-disc ml-6 text-yellow-700">
              <li>Guided Tours</li>
              <li>Local Cuisine</li>
              <li>Nature Walks</li>
            </ul>
          </div>
        </div>
      </section>

  {/* Anchor for search scroll animation */}
  <div id="search-results-anchor"></div>
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
                    <div
                      key={country.id}
                      className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group animate-fade-in"
                      style={{
                        animation: 'fadeInScale 0.5s',
                        animationDelay: `${idx * 0.05}s`,
                        animationFillMode: 'both',
                      }}
                    >
                      <div className="relative overflow-hidden rounded-t-lg">
                        {country.image_url ? (
                          <img 
                            src={country.image_url}
                            alt={country.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            style={{ borderRadius: '0.75rem' }}
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

      {/* Explore Themes Section */}
      <section id="themes" className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Explore Themes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find things to do by interest. Whatever you're into, we've got it!
            </p>
          </div>
          <div className="relative">
            <div className="flex overflow-x-auto scrollbar-hide pb-4 space-x-6">
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
                    <div
                      key={theme.id}
                      className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group relative animate-fade-in"
                      style={{
                        animation: 'fadeInScale 0.5s',
                        animationDelay: `${idx * 0.05}s`,
                        animationFillMode: 'both',
                      }}
                    >
                      <div className="relative overflow-hidden rounded-t-2xl h-56">
                        {theme.image_url ? (
                          <img src={theme.image_url} alt={theme.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" loading="lazy" style={{ borderRadius: '1rem' }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
                            <span className="text-white text-4xl font-bold">{theme.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-40 p-4 rounded-b-2xl">
                        <h3 className="text-2xl font-bold text-white mb-0">{theme.name}</h3>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Themes Available</h3>
                  <p className="text-gray-500">Themes will appear here once they are added to the system.</p>
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
    </>
  );
}