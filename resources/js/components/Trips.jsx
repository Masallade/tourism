import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { extractServiceTypes } from '../utils/serviceHelpers';

const Trips = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchServices();
    fetchServiceTypes();
    fetchCountries();
  }, []);

  useEffect(() => {
    filterServices();
  }, [selectedType, selectedCountry, searchQuery, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services/all');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
      setFilteredServices(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await fetch('/api/service-types');
      if (!response.ok) throw new Error('Failed to fetch service types');
      const data = await response.json();
      setServiceTypes(data);
    } catch (err) {
      console.error('Error fetching service types:', err);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/countries');
      if (!response.ok) throw new Error('Failed to fetch countries');
      const data = await response.json();
      setCountries(data);
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };

  const filterServices = () => {
    let filtered = services;

    // Filter by service type
    if (selectedType !== 'all') {
      filtered = filtered.filter(service => {
        const serviceTypes = extractServiceTypes(service);
        return serviceTypes.some(type => 
          Number(type.id) === Number(selectedType)
        );
      });
    }

    // Filter by country
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(service => {
        const countryId = service.country?.id || service.country_id;
        return Number(countryId) === Number(selectedCountry);
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service => 
        service.name?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        service.country?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredServices(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
          <p className="text-gray-600 text-lg">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
          <p className="text-red-600 text-lg font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            {t('trips')}
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
            {t('discover_providers_subtitle')}
          </p>
          
          {/* Service Types Scrollable Bar with Arrows */}
          <div className="w-full flex justify-center mt-8">
            <div className="relative max-w-4xl w-full">
              <button
                className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm border border-white/30 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                onClick={() => {
                  const scrollElement = document.getElementById('serviceTypeScrollTrips');
                  if (scrollElement) {
                    scrollElement.scrollBy({ left: -200, behavior: 'smooth' });
                  }
                }}
                aria-label="Scroll left"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" className="text-green-700" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div 
                id="serviceTypeScrollTrips" 
                className="flex overflow-x-auto gap-3 px-3 py-3 scrollbar-hide rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/30" 
                style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}
              >
                <button
                  onClick={() => setSelectedType('all')}
                  className={`flex items-center px-5 py-2 rounded-full transition-all duration-300 focus:outline-none whitespace-nowrap shadow-md ${selectedType === 'all' ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium scale-105' : 'bg-white/80 text-gray-800 hover:bg-white'}`}
                >
                  <span className="text-base">{t('all_types')}</span>
                </button>
                {serviceTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id.toString())}
                    className={`flex items-center px-5 py-2 rounded-full transition-all duration-300 focus:outline-none whitespace-nowrap shadow-md ${selectedType === type.id.toString() ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium scale-105' : 'bg-white/80 text-gray-800 hover:bg-white'}`}
                  >
                    <span className="text-base">{type.name}</span>
                  </button>
                ))}
              </div>
              <button
                className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm border border-white/30 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                onClick={() => {
                  const scrollElement = document.getElementById('serviceTypeScrollTrips');
                  if (scrollElement) {
                    scrollElement.scrollBy({ left: 200, behavior: 'smooth' });
                  }
                }}
                aria-label="Scroll right"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" className="text-green-700" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('search')} {t('trips')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
                <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filter_by_country')}
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                <option value="all">{t('all_countries')}</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full">
                <p className="text-gray-600">
                  {t('showing_trips', { count: filteredServices.length, total: services.length })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">{t('no_services')}</h3>
            <p className="text-gray-500 mb-6">{t('try_adjusting_filters')}</p>
            <button
              onClick={() => { setSelectedType('all'); setSearchQuery(''); }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition"
            >
              {t('clear_filters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <Link
                key={service.id}
                to={`/service/${service.id}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Service Image */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-green-400 to-blue-500">
                  {service.image ? (
                    <img
                      src={`/storage/${service.image}`}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Service Type Badge */}
                  {extractServiceTypes(service).length > 0 && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-green-700 rounded-full text-xs font-bold shadow-lg">
                        {extractServiceTypes(service)[0].name}
                      </span>
                    </div>
                  )}

                  {/* Price Badge */}
                  {service.price && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold shadow-lg">
                        ${service.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Service Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition line-clamp-1">
                    {service.name}
                  </h3>

                  {/* Location */}
                  {service.country && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{service.country.name}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {service.description || 'Discover an amazing eco-friendly experience in a beautiful destination.'}
                  </p>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    {service.duration && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {service.duration}
                      </div>
                    )}
                    {service.min_age && service.max_age && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {service.min_age}-{service.max_age} years
                      </div>
                    )}
                  </div>

                  {/* Theme Tag */}
                  {service.theme && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {service.theme.name}
                      </span>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold group-hover:text-green-700 transition">
                      View Details
                    </span>
                    <svg className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Let our AI Assistant help you plan the perfect eco-friendly adventure!
          </p>
          
          <Link 
            to="/ai-assistance" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>Talk to AI Assistant</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          {/* Additional info */}
          <p className="mt-6 text-gray-500 text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Free • Instant • 24/7 Available</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Trips;

