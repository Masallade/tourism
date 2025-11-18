import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom green marker icon for service providers
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom red marker icon for searched locations
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom blue marker icon for services
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom orange marker icon for services
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom purple marker icon for services
const purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom yellow marker icon for services
const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Function to create custom HTML div icon
const createCustomIcon = (html, bgColor, iconColor = 'white') => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: html,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Function to get icon for service based on service type
const getServiceIcon = (serviceTypes) => {
  if (!serviceTypes || serviceTypes.length === 0) {
    return createCustomIcon(
      '<div style="background: #3b82f6; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;"><div style="transform: rotate(45deg); color: white; font-size: 20px;">📍</div></div>',
      '#3b82f6'
    );
  }
  
  // Get the first service type name
  const typeName = serviceTypes[0]?.name?.toLowerCase() || '';
  
  // Assign icons based on service type
  if (typeName.includes('tour') || typeName.includes('guide')) {
    // Tour/Guide - Blue with map icon
    return createCustomIcon(
      '<div style="background: #3b82f6; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;"><div style="transform: rotate(45deg); color: white; font-size: 20px;">🗺️</div></div>',
      '#3b82f6'
    );
  } else if (typeName.includes('accommodation') || typeName.includes('hotel') || typeName.includes('lodge')) {
    // Accommodation - Orange with bed icon
    return createCustomIcon(
      '<div style="background: #f97316; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;"><div style="transform: rotate(45deg); color: white; font-size: 20px;">🛏️</div></div>',
      '#f97316'
    );
  } else if (typeName.includes('restaurant') || typeName.includes('food') || typeName.includes('dining')) {
    // Restaurant/Food - Yellow with fork/knife icon
    return createCustomIcon(
      '<div style="background: #eab308; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;"><div style="transform: rotate(45deg); color: white; font-size: 20px;">🍴</div></div>',
      '#eab308'
    );
  } else if (typeName.includes('activity') || typeName.includes('adventure')) {
    // Activity/Adventure - Purple with hiking icon
    return createCustomIcon(
      '<div style="background: #a855f7; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;"><div style="transform: rotate(45deg); color: white; font-size: 20px;">⛰️</div></div>',
      '#a855f7'
    );
  } else if (typeName.includes('transport') || typeName.includes('vehicle') || typeName.includes('car')) {
    // Transportation - Cyan with car icon
    return createCustomIcon(
      '<div style="background: #06b6d4; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;"><div style="transform: rotate(45deg); color: white; font-size: 20px;">🚗</div></div>',
      '#06b6d4'
    );
  } else if (typeName.includes('shopping') || typeName.includes('market') || typeName.includes('store')) {
    // Shopping - Pink with shopping bag icon
    return createCustomIcon(
      '<div style="background: #ec4899; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;"><div style="transform: rotate(45deg); color: white; font-size: 20px;">🛍️</div></div>',
      '#ec4899'
    );
  } else if (typeName.includes('spa') || typeName.includes('wellness') || typeName.includes('relaxation')) {
    // Spa/Wellness - Teal with spa icon
    return createCustomIcon(
      '<div style="background: #14b8a6; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;"><div style="transform: rotate(45deg); color: white; font-size: 20px;">💆</div></div>',
      '#14b8a6'
    );
  } else {
    // Default - Blue with location pin
    return createCustomIcon(
      '<div style="background: #3b82f6; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;"><div style="transform: rotate(45deg); color: white; font-size: 20px;">📍</div></div>',
      '#3b82f6'
    );
  }
};

// Component to fit bounds when providers/services change or zoom to searched location
function MapBounds({ providers, services, searchedLocation }) {
  const map = useMap();
  
  useEffect(() => {
    if (searchedLocation) {
      // Zoom to searched location with higher zoom level
      const zoomLevel = searchedLocation.type === 'country' ? 6 : 
                        searchedLocation.type === 'city' ? 12 : 15;
      
      map.setView([searchedLocation.lat, searchedLocation.lng], zoomLevel, {
        animate: true,
        duration: 1.5
      });
    } else {
      // Combine providers and services for bounds calculation
      const allLocations = [
        ...providers.filter(p => p.lat && p.lng).map(p => [parseFloat(p.lat), parseFloat(p.lng)]),
        ...services.filter(s => s.lat && s.lng).map(s => [parseFloat(s.lat), parseFloat(s.lng)])
      ];
      
      if (allLocations.length > 0) {
        map.fitBounds(allLocations, { padding: [50, 50], maxZoom: 12 });
      }
    }
  }, [providers, services, searchedLocation, map]);
  
  return null;
}

const ProvidersMap = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [countries, setCountries] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchType, setSearchType] = useState('provider'); // 'provider' or 'location'
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

  useEffect(() => {
    fetchProviders();
    fetchServices();
    fetchCountries();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-input-container')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    filterProviders();
    filterServices();
  }, [searchQuery, selectedCountry, providers, services, searchType]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/service-providers');
      if (!response.ok) throw new Error('Failed to fetch providers');
      const data = await response.json();
      
      // Only include providers with valid coordinates
      const validProviders = data.filter(p => p.lat && p.lng && p.is_approved);
      
      setProviders(validProviders);
      setFilteredProviders(validProviders);
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services/all');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      
      // Only include services with valid coordinates
      const validServices = data.filter(s => s.lat && s.lng);
      
      setServices(validServices);
      setFilteredServices(validServices);
    } catch (err) {
      console.error('Error fetching services:', err);
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

  const fetchLocationSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setLocationSuggestions([]);
      setIsFetchingSuggestions(false);
      return;
    }

    try {
      setIsFetchingSuggestions(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setLocationSuggestions(data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setLocationSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  const geocodeLocation = async (locationData) => {
    setIsGeocoding(true);
    setShowSuggestions(false);
    
    try {
      let location;
      
      // If locationData is already an object (from suggestion click)
      if (typeof locationData === 'object' && locationData.lat) {
        location = {
          lat: parseFloat(locationData.lat),
          lng: parseFloat(locationData.lon),
          name: locationData.display_name,
          type: locationData.type || 'location',
          address: locationData.address || {}
        };
      } else {
        // If it's a string (from enter key or direct search)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationData)}&limit=1&addressdetails=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          const bestResult = data[0];
          location = {
            lat: parseFloat(bestResult.lat),
            lng: parseFloat(bestResult.lon),
            name: bestResult.display_name,
            type: bestResult.type || 'location',
            address: bestResult.address || {}
          };
        }
      }
      
      if (location) {
        setSearchedLocation(location);
        console.log('Selected location:', location);
      } else {
        console.log('No results found');
        setSearchedLocation(null);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setSearchedLocation(null);
    } finally {
      setIsGeocoding(false);
    }
  };

  const filterProviders = async () => {
    let filtered = providers;

    console.log('Starting filter. Total providers:', providers.length);
    console.log('Search query:', searchQuery);
    console.log('Search type:', searchType);
    console.log('Selected country:', selectedCountry);

    // Reset searched location when changing filters
    setSearchedLocation(null);

    // Filter by country
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(p => p.country_id === parseInt(selectedCountry));
      console.log('After country filter:', filtered.length);
    }

    // Handle search based on search type
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      console.log('Searching for:', query);
      
      if (searchType === 'location') {
        // Location search: geocode and show all providers
        console.log('Location search - geocoding:', searchQuery);
        await geocodeLocation(searchQuery);
        filtered = providers; // Show all providers with location zoom
      } else {
        // Provider search: filter providers
        filtered = filtered.filter(p => {
          // Search in provider name
          const nameMatch = p.name?.toLowerCase().includes(query);
          
          // Search in description
          const descriptionMatch = p.description?.toLowerCase().includes(query);
          
          // Search in country name
          const countryMatch = p.country?.name?.toLowerCase().includes(query);
          
          // Search in service types
          const serviceTypeMatch = p.service_types?.some(st => 
            st.name?.toLowerCase().includes(query)
          ) || false;
          
          // Search in themes
          const themeMatch = p.themes?.some(theme => 
            theme.name?.toLowerCase().includes(query)
          ) || false;

          const matches = nameMatch || descriptionMatch || countryMatch || serviceTypeMatch || themeMatch;
          
          if (matches) {
            console.log(`Provider "${p.name}" matched:`, {
              nameMatch,
              descriptionMatch,
              countryMatch,
              countryName: p.country?.name,
              serviceTypeMatch,
              themeMatch
            });
          }

          return matches;
        });
        
        console.log('After provider search filter:', filtered.length);
      }
    }

    console.log('Final filtered providers:', filtered.length);
    setFilteredProviders(filtered);
  };

  const filterServices = async () => {
    let filtered = services;

    // Reset searched location when changing filters
    setSearchedLocation(null);

    // Filter by country
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(s => s.country_id === parseInt(selectedCountry));
    }

    // Handle search based on search type
    if (searchQuery.trim() && searchType === 'provider') {
      const query = searchQuery.toLowerCase();
      
      // Service search: filter services
      filtered = filtered.filter(s => {
        // Search in service name
        const nameMatch = s.name?.toLowerCase().includes(query);
        
        // Search in description
        const descriptionMatch = s.description?.toLowerCase().includes(query);
        
        // Search in country name
        const countryMatch = s.country?.name?.toLowerCase().includes(query);
        
        // Search in service types
        const serviceTypeMatch = s.service_types?.some(st => 
          st.name?.toLowerCase().includes(query)
        ) || false;
        
        // Search in themes
        const themeMatch = s.themes?.some(theme => 
          theme.name?.toLowerCase().includes(query)
        ) || false;

        return nameMatch || descriptionMatch || countryMatch || serviceTypeMatch || themeMatch;
      });
    }

    setFilteredServices(filtered);
  };

  const handleMarkerClick = (provider) => {
    // Optional: Could open a modal or navigate to provider detail
    console.log('Provider clicked:', provider);
  };

  const handleServiceClick = (service) => {
    // Optional: Could open a modal or navigate to service detail
    console.log('Service clicked:', service);
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style>{`
        .leaflet-container .leaflet-control-attribution {
          display: none !important;
        }
        .leaflet-tile-pane::before,
        .leaflet-tile-pane::after {
          display: none !important;
        }
        .leaflet-container::before,
        .leaflet-container::after {
          display: none !important;
        }
        .custom-marker-icon {
          background: transparent !important;
          border: none !important;
        }
        .custom-marker-icon > div {
          transition: transform 0.2s;
        }
        .custom-marker-icon:hover > div {
          transform: rotate(-45deg) scale(1.1);
        }
      `}</style>
      {/* Search and Filter Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        {/* Search Type Toggle */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Search for:</span>
          <div className="inline-flex rounded-lg border border-gray-300 bg-gray-50 p-1">
            <button
              onClick={() => setSearchType('provider')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                searchType === 'provider'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              🏢 Service Provider
            </button>
            <button
              onClick={() => setSearchType('location')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                searchType === 'location'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              📍 Location
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {searchType === 'provider' ? 'Search Service Providers' : 'Search Location'}
            </label>
            <div className="relative search-input-container">
              <input
                type="text"
                placeholder={
                  searchType === 'provider'
                    ? 'Search providers and services by name, description, themes...'
                    : 'e.g., Lahore, Ichhra Lahore, Ferozepur Road, Pakistan...'
                }
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  
                  // Clear previous timeout
                  if (debounceTimeout) clearTimeout(debounceTimeout);
                  
                  if (searchType === 'location' && e.target.value.length >= 2) {
                    // Debounce: wait 500ms after user stops typing
                    const timeout = setTimeout(() => {
                      fetchLocationSuggestions(e.target.value);
                    }, 500);
                    setDebounceTimeout(timeout);
                  } else {
                    setShowSuggestions(false);
                    setLocationSuggestions([]);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchType === 'location' && searchQuery.trim()) {
                    geocodeLocation(searchQuery);
                  }
                }}
                onFocus={() => {
                  if (searchType === 'location' && locationSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              {/* Location Suggestions Dropdown */}
              {searchType === 'location' && (isFetchingSuggestions || (showSuggestions && locationSuggestions.length > 0)) && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                  {isFetchingSuggestions ? (
                    <div className="px-4 py-3 text-center text-gray-500">
                      <svg className="animate-spin h-5 w-5 mx-auto mb-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-xs">Loading suggestions...</p>
                    </div>
                  ) : (
                    locationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion.display_name);
                          geocodeLocation(suggestion);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition"
                      >
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {suggestion.display_name.split(',')[0]}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {suggestion.display_name}
                            </p>
                            <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {suggestion.type || 'location'}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold text-green-600">{filteredProviders.length}</span> of {providers.length} providers
              {filteredServices.length > 0 && (
                <span> and <span className="font-bold text-blue-600">{filteredServices.length}</span> of {services.length} services</span>
              )}
            </p>
            {searchedLocation && (
              <p className="text-sm text-blue-600 mt-1">
                📍 Map zoomed to: <span className="font-medium">{searchedLocation.name}</span>
              </p>
            )}
            {isGeocoding && (
              <p className="text-sm text-gray-500 mt-1">
                🔍 Searching for location...
              </p>
            )}
            {searchType === 'location' && searchQuery && !searchedLocation && !isGeocoding && (
              <p className="text-sm text-orange-600 mt-1">
                ⚠️ Location not found. Try: "Ichhra Lahore" or "Ferozepur Road Lahore"
              </p>
            )}
          </div>
          {(searchQuery || selectedCountry !== 'all' || searchType !== 'provider') && (
            <button
              onClick={() => { 
                setSearchQuery(''); 
                setSelectedCountry('all'); 
                setSearchedLocation(null); 
                setSearchType('provider');
                setShowSuggestions(false);
                setLocationSuggestions([]);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-green-100">
        {filteredProviders.length === 0 && filteredServices.length === 0 && !searchedLocation ? (
          <div className="w-full h-[600px] flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="mx-auto w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No providers or services found</h3>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={[25.276987, 55.296249]}
            zoom={2}
            style={{ height: '600px', width: '100%' }}
            className="z-10"
            maxBounds={[[-90, -180], [90, 180]]}
            maxBoundsViscosity={1.0}
            minZoom={2}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={20}
              noWrap={true}
            />
            
            {/* Fit bounds to show all markers or zoom to searched location */}
            <MapBounds providers={filteredProviders} services={filteredServices} searchedLocation={searchedLocation} />
            
            {/* Markers for each provider */}
            {filteredProviders.map((provider) => (
              <Marker
                key={provider.id}
                position={[parseFloat(provider.lat), parseFloat(provider.lng)]}
                icon={greenIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(provider)
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    {/* Provider Image */}
                    {provider.image && (
                      <img
                        src={`/storage/${provider.image}`}
                        alt={provider.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    
                    {/* Provider Name */}
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {provider.name}
                    </h3>
                    
                    {/* Location */}
                    {provider.country && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{provider.country.name}</span>
                      </div>
                    )}
                    
                    {/* Service Types */}
                    {provider.service_types && provider.service_types.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {provider.service_types.slice(0, 3).map((type) => (
                            <span
                              key={type.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              {type.name}
                            </span>
                          ))}
                          {provider.service_types.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{provider.service_types.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Description */}
                    {provider.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {provider.description}
                      </p>
                    )}
                    
                    {/* Price Range */}
                    {provider.price_range && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Price: <span className="text-green-600">{provider.price_range}</span>
                        </span>
                      </div>
                    )}
                    
                    {/* View Details Button */}
                    <a
                      href={`#provider-${provider.id}`}
                      className="block w-full text-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-blue-600 transition"
                    >
                      View Details
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Markers for each service */}
            {filteredServices.map((service) => (
              <Marker
                key={`service-${service.id}`}
                position={[parseFloat(service.lat), parseFloat(service.lng)]}
                icon={getServiceIcon(service.service_types)}
                eventHandlers={{
                  click: () => handleServiceClick(service)
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    {/* Service Image */}
                    {service.image && (
                      <img
                        src={`/storage/${service.image}`}
                        alt={service.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    
                    {/* Service Name */}
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {service.name}
                    </h3>
                    
                    {/* Location */}
                    {service.country && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{service.country.name}</span>
                      </div>
                    )}
                    
                    {/* Service Types */}
                    {service.service_types && service.service_types.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {service.service_types.slice(0, 3).map((type) => (
                            <span
                              key={type.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {type.name}
                            </span>
                          ))}
                          {service.service_types.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{service.service_types.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Description */}
                    {service.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    
                    {/* Price */}
                    {service.price && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Price: <span className="text-blue-600">${service.price}</span>
                        </span>
                      </div>
                    )}
                    
                    {/* View Details Button */}
                    <a
                      href={`/service/${service.id}`}
                      className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition"
                    >
                      View Service Details
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Map Legend */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full mr-2 flex items-center justify-center text-white text-sm font-bold">P</div>
            <span className="text-sm text-gray-700">Service Provider</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full mr-2 flex items-center justify-center text-white text-lg">🗺️</div>
            <span className="text-sm text-gray-700">Tour/Guide</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-full mr-2 flex items-center justify-center text-white text-lg">🛏️</div>
            <span className="text-sm text-gray-700">Accommodation</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-full mr-2 flex items-center justify-center text-white text-lg">🍴</div>
            <span className="text-sm text-gray-700">Restaurant/Food</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-500 rounded-full mr-2 flex items-center justify-center text-white text-lg">⛰️</div>
            <span className="text-sm text-gray-700">Activity/Adventure</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-cyan-500 rounded-full mr-2 flex items-center justify-center text-white text-lg">🚗</div>
            <span className="text-sm text-gray-700">Transportation</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-pink-500 rounded-full mr-2 flex items-center justify-center text-white text-lg">🛍️</div>
            <span className="text-sm text-gray-700">Shopping</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-teal-500 rounded-full mr-2 flex items-center justify-center text-white text-lg">💆</div>
            <span className="text-sm text-gray-700">Spa/Wellness</span>
          </div>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm text-gray-700">Click markers for details</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidersMap;

