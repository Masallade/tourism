
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { extractServiceTypes, extractThemes } from '../utils/serviceHelpers';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const ServiceForm = ({ serviceTypes, themes = [], country, provider, onSubmit, onClose, loading, service = null }) => {
  const [name, setName] = useState(service?.name || '');
  const [description, setDescription] = useState(service?.description || '');
  const [price, setPrice] = useState(service?.price || '');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(service?.image ? `/storage/${service.image}` : null);
  const [image2, setImage2] = useState(null);
  const [image2Preview, setImage2Preview] = useState(service?.image_2 ? `/storage/${service.image_2}` : null);
  const [image3, setImage3] = useState(null);
  const [image3Preview, setImage3Preview] = useState(service?.image_3 ? `/storage/${service.image_3}` : null);
  const [minAge, setMinAge] = useState(service?.min_age || '1');
  const [maxAge, setMaxAge] = useState(service?.max_age || '70');
  const [duration, setDuration] = useState(service?.duration || '');
  const [overview, setOverview] = useState(service?.overview || '');
  const [details, setDetails] = useState(service?.details || '');
  const [error, setError] = useState('');
  const [lat, setLat] = useState(service?.lat || '');
  const [lng, setLng] = useState(service?.lng || '');
  const [position, setPosition] = useState([
    service?.lat ? parseFloat(service.lat) : 25.276987,
    service?.lng ? parseFloat(service.lng) : 55.296249
  ]);
  const [selectedServiceTypeIds, setSelectedServiceTypeIds] = useState(() => {
    const existing = extractServiceTypes(service).map(({ id }) => Number(id));
    if (existing.length) return existing;
    return serviceTypes?.length ? [Number(serviceTypes[0].id)] : [];
  });
  const [selectedThemeIds, setSelectedThemeIds] = useState(() => {
    const existing = extractThemes(service).map(({ id }) => Number(id));
    if (existing.length) return existing;
    return themes?.length ? [Number(themes[0].id)] : [];
  });

  useEffect(() => {
    if (service) {
      const currentTypes = extractServiceTypes(service).map(({ id }) => Number(id));
      setSelectedServiceTypeIds(currentTypes.length ? currentTypes : (serviceTypes?.length ? [Number(serviceTypes[0].id)] : []));
      const currentThemes = extractThemes(service).map(({ id }) => Number(id));
      setSelectedThemeIds(currentThemes.length ? currentThemes : (themes?.length ? [Number(themes[0].id)] : []));
    } else {
      setSelectedServiceTypeIds(serviceTypes?.length ? [Number(serviceTypes[0].id)] : []);
      setSelectedThemeIds(themes?.length ? [Number(themes[0].id)] : []);
    }
  }, [service, serviceTypes, themes]);

  useEffect(() => {
    if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
      setPosition([parseFloat(lat), parseFloat(lng)]);
    }
  }, [lat, lng]);

  // Map marker drag handler
  const DraggableMarker = () => {
    const markerRef = useRef(null);
    const eventHandlers = {
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat: newLat, lng: newLng } = marker.getLatLng();
          setLat(newLat.toFixed(7));
          setLng(newLng.toFixed(7));
        }
      }
    };
    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      />
    );
  };

  // Map click handler
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat: newLat, lng: newLng } = e.latlng;
        setLat(newLat.toFixed(7));
        setLng(newLng.toFixed(7));
        setPosition([newLat, newLng]);
      },
    });
    return null;
  };

  const toggleServiceType = (id) => {
    setSelectedServiceTypeIds(prev => {
      const numericId = Number(id);
      return prev.includes(numericId)
        ? prev.filter(existing => existing !== numericId)
        : [...prev, numericId];
    });
  };

  const toggleTheme = (id) => {
    setSelectedThemeIds(prev => {
      const numericId = Number(id);
      return prev.includes(numericId)
        ? prev.filter(existing => existing !== numericId)
        : [...prev, numericId];
    });
  };

  // Handle image upload and preview for all images
  const handleImageChange = (e, imageNum) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (imageNum === 1) {
          setImage(file);
          setImagePreview(reader.result);
        } else if (imageNum === 2) {
          setImage2(file);
          setImage2Preview(reader.result);
        } else if (imageNum === 3) {
          setImage3(file);
          setImage3Preview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name) {
      setError('Service name is required.');
      return;
    }
    if (!selectedServiceTypeIds.length) {
      setError('Please select at least one service type.');
      return;
    }
    if (!selectedThemeIds.length) {
      setError('Please select at least one theme.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description || '');
    formData.append('overview', overview || '');
    formData.append('details', details || '');
    formData.append('price', price || '');
    formData.append('min_age', minAge || '');
    formData.append('max_age', maxAge || '');
    formData.append('duration', duration || '');
    formData.append('country_id', country?.id);
    formData.append('provider_id', provider?.id);
    formData.append('lat', lat);
    formData.append('lng', lng);
    selectedServiceTypeIds.forEach(id => formData.append('service_type_ids[]', id));
    selectedThemeIds.forEach(id => formData.append('theme_ids[]', id));
    // Append images if they exist
    if (image) formData.append('image', image);
    if (image2) formData.append('image_2', image2);
    if (image3) formData.append('image_3', image3);
    // Pass service ID if editing
    if (service) {
      formData.append('_method', 'PUT'); // Laravel method spoofing for FormData
    }
    onSubmit(formData, service?.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      {/* Service Name Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Service Name</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" 
          placeholder="Enter service name"
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Service Types</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {serviceTypes.length ? (
              serviceTypes.map((type) => {
                const numericId = Number(type.id);
                const isChecked = selectedServiceTypeIds.includes(numericId);
                return (
                  <label
                    key={type.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-150 cursor-pointer ${
                      isChecked ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-200 hover:border-green-300 hover:bg-green-50/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      checked={isChecked}
                      onChange={() => toggleServiceType(numericId)}
                    />
                    <span className="text-sm font-medium text-gray-700 leading-tight">{type.name}</span>
                  </label>
                );
              })
            ) : (
              <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4">
                No service types are available for this provider. Please contact the administrator.
              </div>
            )}
          </div>
          {!selectedServiceTypeIds.length && (
            <p className="text-sm text-red-500 mt-2">Select at least one service type.</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Themes</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.length ? (
              themes.map((theme) => {
                const numericId = Number(theme.id);
                const isChecked = selectedThemeIds.includes(numericId);
                return (
                  <label
                    key={theme.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-150 cursor-pointer ${
                      isChecked ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={isChecked}
                      onChange={() => toggleTheme(numericId)}
                    />
                    <span className="text-sm font-medium text-gray-700 leading-tight">{theme.name}</span>
                  </label>
                );
              })
            ) : (
              <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4">
                No themes are assigned yet. Please contact the administrator to add themes.
              </div>
            )}
          </div>
          {!selectedThemeIds.length && (
            <p className="text-sm text-red-500 mt-2">Select at least one theme.</p>
          )}
        </div>
      </div>
      
      {/* Country Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Country</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-600" 
          value={country?.name || 'Unknown'} 
          disabled 
        />
        {country?.id && (
          <input type="hidden" name="country_id" value={country.id} />
        )}
        {!country?.id && (
          <div className="flex items-center mt-2 text-red-500 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Warning: No country ID available
          </div>
        )}
      </div>
      
      {/* Overview Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Overview</label>
        <textarea 
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors min-h-[100px]" 
          placeholder="Provide a brief overview of your service..."
          value={overview} 
          onChange={e => setOverview(e.target.value)}
        />
      </div>
      
      {/* Description Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Description</label>
        <textarea 
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors min-h-[100px]" 
          placeholder="Describe your service..."
          value={description} 
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      
      {/* Details Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Details</label>
        <textarea 
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors min-h-[100px]" 
          placeholder="Provide detailed information about your service..."
          value={details} 
          onChange={e => setDetails(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Age Range Fields */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Age Range</label>
          <div className="flex gap-2 items-center">
            <input 
              type="number" 
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" 
              placeholder="Min Age"
              value={minAge} 
              onChange={e => setMinAge(e.target.value)} 
              min="0" 
              max="100" 
            />
            <span className="text-gray-500">to</span>
            <input 
              type="number" 
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" 
              placeholder="Max Age"
              value={maxAge} 
              onChange={e => setMaxAge(e.target.value)} 
              min="0" 
              max="100" 
            />
          </div>
        </div>
        
        {/* Duration Field */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Duration</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" 
            placeholder="e.g., 2h, 3 days, 8h"
            value={duration} 
            onChange={e => setDuration(e.target.value)} 
          />
        </div>
        
        {/* Price Field */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Price</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input 
              type="number" 
              className="w-full pl-8 px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" 
              placeholder="0.00"
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              min="0" 
              step="0.01" 
            />
          </div>
        </div>
      </div>
      
      {/* Location Picker */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Service Location (Pick on map)</label>
        <div className="w-full h-64 border-2 border-blue-200 rounded-lg mb-3 overflow-hidden">
          {typeof window !== 'undefined' && (
            <MapContainer 
              center={position} 
              zoom={13} 
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <DraggableMarker />
              <MapClickHandler />
            </MapContainer>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Latitude</label>
            <input
              type="text"
              value={lat}
              onChange={e => setLat(e.target.value)}
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
              placeholder="Latitude"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Longitude</label>
            <input
              type="text"
              value={lng}
              onChange={e => setLng(e.target.value)}
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900"
              placeholder="Longitude"
            />
          </div>
        </div>
      </div>

      {/* Image Upload Fields */}
      <label className="block text-gray-700 font-medium mb-2">Service Images (Upload up to 3)</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Image 1 Upload Field */}
        <div>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-gray-200 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              {imagePreview ? (
                <div className="relative w-full h-full p-1">
                  <img 
                    src={imagePreview} 
                    alt="Image 1 preview" 
                    className="h-full w-full object-cover rounded-md"
                  />
                  <button 
                    type="button" 
                    className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Main Image</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleImageChange(e, 1)} 
              />
            </label>
          </div>
        </div>
        
        {/* Image 2 Upload Field */}
        <div>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-gray-200 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              {image2Preview ? (
                <div className="relative w-full h-full p-1">
                  <img 
                    src={image2Preview} 
                    alt="Image 2 preview" 
                    className="h-full w-full object-cover rounded-md"
                  />
                  <button 
                    type="button" 
                    className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100"
                    onClick={() => {
                      setImage2(null);
                      setImage2Preview(null);
                    }}
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Second Image</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleImageChange(e, 2)} 
              />
            </label>
          </div>
        </div>
        
        {/* Image 3 Upload Field */}
        <div>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-gray-200 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              {image3Preview ? (
                <div className="relative w-full h-full p-1">
                  <img 
                    src={image3Preview} 
                    alt="Image 3 preview" 
                    className="h-full w-full object-cover rounded-md"
                  />
                  <button 
                    type="button" 
                    className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100"
                    onClick={() => {
                      setImage3(null);
                      setImage3Preview(null);
                    }}
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Third Image</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleImageChange(e, 3)} 
              />
            </label>
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
        <button 
          type="button" 
          className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300" 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-md font-medium hover:from-green-600 hover:to-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {service ? 'Update Service' : 'Add Service'}
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
