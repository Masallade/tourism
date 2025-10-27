import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Trips = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchServices();
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    filterServices();
  }, [selectedType, searchQuery, services]);

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

  const filterServices = () => {
    let filtered = services;

    // Filter by service type
    if (selectedType !== 'all') {
      filtered = filtered.filter(service => 
        service.service_type_id === parseInt(selectedType)
      );
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
          <p className="text-gray-600 text-lg">Loading amazing trips...</p>
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
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Explore Eco-Friendly Trips
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
            Discover sustainable adventures and experiences from verified eco-travel providers
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Trips
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

            {/* Service Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                <option value="all">All Types</option>
                {serviceTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Showing <span className="font-bold text-green-600">{filteredServices.length}</span> of <span className="font-bold">{services.length}</span> trips
            </p>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No trips found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={() => { setSelectedType('all'); setSearchQuery(''); }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition"
            >
              Clear Filters
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
                  {service.service_type && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-green-700 rounded-full text-xs font-bold shadow-lg">
                        {service.service_type.name}
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
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Let our AI Assistant help you plan the perfect eco-friendly adventure!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/ai-assistance" 
              className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg"
            >
              Talk to AI Assistant
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trips;

