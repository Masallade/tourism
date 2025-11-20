import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ServiceForm from './ServiceForm';
import StaticMap from './StaticMap';
import { extractServiceTypes, extractThemes } from '../utils/serviceHelpers';
import { countryCodes } from '../utils/countryCodes';

// Fix Leaflet default icon issue
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

const ServiceProviderDashboard = ({ provider, onLogout, onProviderUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState('');
  const [serviceTypes, setServiceTypes] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(null);
  const [services, setServices] = useState([]);
  const [showProfileView, setShowProfileView] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [allCountries, setAllCountries] = useState([]);
  const [allThemes, setAllThemes] = useState([]);
  const [allServiceTypes, setAllServiceTypes] = useState([]);
  const [editFormData, setEditFormData] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editDocuments, setEditDocuments] = useState([]);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState('');
  const [editLocation, setEditLocation] = useState({ lat: '', lng: '' });
  const [mapPosition, setMapPosition] = useState([24.8607, 67.0011]); // Default to Karachi

  const getServiceTypesFor = (svc) => extractServiceTypes(svc).map((type) => ({
    ...type,
    id: Number(type.id),
  }));

  const getThemesFor = (svc) => extractThemes(svc).map((theme) => ({
    ...theme,
    id: Number(theme.id),
  }));

  const handleProviderLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Fetch all data for dropdowns (countries, themes, service types)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all countries
        const countriesRes = await window.apiClient.get('/api/countries');
        setAllCountries(countriesRes.data || []);
        
        // Fetch all themes
        const themesRes = await window.apiClient.get('/api/themes');
        setAllThemes(themesRes.data || []);
        
        // Fetch all service types
        const serviceTypesRes = await window.apiClient.get('/api/service-types');
        setAllServiceTypes(serviceTypesRes.data || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    // Fetch allowed service types, country, and all themes for this provider
    async function fetchTypesCountryThemes() {
      setLoading(true);
      try {
        let types = [];
        if (provider?.id) {
          const res = await window.apiClient.get(`/api/provider/${provider.id}/service-types`);
          types = res.data;
        } else if (provider?.serviceTypes) {
          types = provider.serviceTypes;
        } else {
          const res = await window.apiClient.get('/api/service-types');
          types = res.data;
        }
        setServiceTypes(types);
        // Only use provider's assigned themes
        if (provider?.themes) {
          setThemes(provider.themes);
        } else if (provider?.id) {
          // fallback: fetch provider with themes
          const res = await window.apiClient.get(`/api/service-providers`);
          const allProviders = res.data;
          const found = allProviders.find(p => p.id === provider.id);
          setThemes(found?.themes || []);
        } else {
          setThemes([]);
        }
        
        // Fetch country data
        if (provider?.country) {
          console.log('Using provider country:', provider.country);
          setCountry(provider.country);
        } else if (provider?.country_id) {
          // Use allCountries if already loaded, otherwise fetch
          if (allCountries.length > 0) {
            const foundCountry = allCountries.find(c => c.id === provider.country_id);
            setCountry(foundCountry || null);
          } else {
            const cres = await window.apiClient.get(`/api/countries`);
            const countries = cres.data;
            const foundCountry = countries.find(c => c.id === provider.country_id);
            console.log('Found country by ID:', foundCountry);
            setCountry(foundCountry || null);
          }
        } else {
          // No fallback, only use what's explicitly provided
          console.log('No country information available for provider');
          setCountry(null);
        }

        // Fetch provider's services if available
        if (provider?.id) {
          try {
            const servicesRes = await window.apiClient.get(`/api/provider/services?provider_id=${provider.id}`);
            const servicesData = servicesRes.data;
            setServices(servicesData);
          } catch (error) {
            console.error('Failed to fetch provider services:', error);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    fetchTypesCountryThemes();
  }, [provider, allCountries]);

  // Initialize edit form data when entering edit mode
  useEffect(() => {
    if (isEditMode && provider) {
      const serviceTypeIds = (provider.service_types || provider.serviceTypes || []).map(st => Number(st.id));
      const themeIds = (provider.themes || []).map(t => Number(t.id));
      
      // Initialize location
      const lat = provider.lat ? parseFloat(provider.lat) : '';
      const lng = provider.lng ? parseFloat(provider.lng) : '';
      setEditLocation({ lat: lat || '', lng: lng || '' });
      
      // Set map position
      if (lat && lng) {
        setMapPosition([lat, lng]);
      } else {
        setMapPosition([24.8607, 67.0011]); // Default to Karachi
      }
      
      setEditFormData({
        name: provider.name || '',
        email: provider.email || '',
        phone: provider.phone || '',
        country_code: provider.country_code || '',
        website: provider.website || '',
        description: provider.description || '',
        country_id: provider.country_id || '',
        price_range: provider.price_range || '',
        service_type_ids: serviceTypeIds,
        themes: themeIds,
        lat: lat || '',
        lng: lng || '',
      });
      
      // Set image preview if exists
      if (provider.image) {
        const imagePath = provider.image.startsWith('/storage/') 
          ? provider.image 
          : `/storage/${provider.image}`;
        setEditImagePreview(imagePath);
      } else {
        setEditImagePreview(null);
      }
    }
  }, [isEditMode, provider]);

  // Handle image preview
  useEffect(() => {
    if (editImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(editImageFile);
    }
  }, [editImageFile]);



  const handleAddService = () => {
    setEditingService(null);
    setShowForm(true);
  };
  
  const handleEditService = (service) => {
    setEditingService(service);
    setShowForm(true);
  };
  
  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }
    
    try {
      await window.apiClient.delete(`/api/provider/services/${serviceId}`);
      setServices(prev => prev.filter(s => s.id !== serviceId));
      alert('Service deleted successfully!');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('An error occurred while deleting the service');
    }
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
  };

  // Profile Edit Handlers
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Update location state and map position if lat/lng changed
    if (name === 'lat' || name === 'lng') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setEditLocation(prev => {
          const newLocation = { ...prev, [name]: value };
          if (newLocation.lat && newLocation.lng) {
            setMapPosition([parseFloat(newLocation.lat), parseFloat(newLocation.lng)]);
          }
          return newLocation;
        });
      } else {
        setEditLocation(prev => ({ ...prev, [name]: value }));
      }
    }
  };
  
  // Handle location update from map
  const handleLocationUpdate = (lat, lng) => {
    const latStr = lat.toFixed(7);
    const lngStr = lng.toFixed(7);
    setEditLocation({ lat: latStr, lng: lngStr });
    setMapPosition([lat, lng]);
    setEditFormData(prev => ({
      ...prev,
      lat: latStr,
      lng: lngStr
    }));
  };

  const handleServiceTypeToggle = (typeId) => {
    setEditFormData(prev => {
      const currentIds = prev.service_type_ids || [];
      const isSelected = currentIds.includes(Number(typeId));
      return {
        ...prev,
        service_type_ids: isSelected
          ? currentIds.filter(id => id !== Number(typeId))
          : [...currentIds, Number(typeId)]
      };
    });
  };

  const handleThemeToggle = (themeId) => {
    setEditFormData(prev => {
      const currentIds = prev.themes || [];
      const isSelected = currentIds.includes(Number(themeId));
      return {
        ...prev,
        themes: isSelected
          ? currentIds.filter(id => id !== Number(themeId))
          : [...currentIds, Number(themeId)]
      };
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileUpdateError('');

    try {
      const form = new FormData();
      
      // Add all form fields
      form.append('name', editFormData.name);
      form.append('email', editFormData.email || '');
      form.append('phone', editFormData.phone || '');
      form.append('country_code', editFormData.country_code || '');
      form.append('website', editFormData.website || '');
      form.append('description', editFormData.description || '');
      form.append('country_id', editFormData.country_id);
      form.append('price_range', editFormData.price_range);
      
      // Add service type IDs
      if (editFormData.service_type_ids && editFormData.service_type_ids.length > 0) {
        editFormData.service_type_ids.forEach(id => {
          form.append('service_type_ids[]', id);
        });
      }
      
      // Add themes
      if (editFormData.themes && editFormData.themes.length > 0) {
        editFormData.themes.forEach(id => {
          form.append('themes[]', id);
        });
      }
      
      // Add image if new one is selected
      if (editImageFile) {
        form.append('image', editImageFile);
      }
      
      // Add documents if new ones are selected
      if (editDocuments.length > 0) {
        editDocuments.forEach(doc => {
          form.append('documents[]', doc);
        });
      }
      
      // Add location if provided
      if (editFormData.lat && editFormData.lng) {
        form.append('lat', editFormData.lat);
        form.append('lng', editFormData.lng);
      }

      const response = await window.apiClient.upload(`/api/service-providers/${provider.id}/update`, form);
      
      // Update provider data immediately in UI
      if (response.data) {
        const updatedProvider = response.data;
        
        // Update parent component's provider state
        if (onProviderUpdate) {
          onProviderUpdate(updatedProvider);
        }
        
        // Update local state for country, serviceTypes, themes
        if (updatedProvider.country) {
          setCountry(updatedProvider.country);
        } else if (updatedProvider.country_id) {
          const foundCountry = allCountries.find(c => c.id === updatedProvider.country_id);
          if (foundCountry) {
            setCountry(foundCountry);
          }
        }
        
        if (updatedProvider.serviceTypes) {
          setServiceTypes(updatedProvider.serviceTypes);
        }
        
        if (updatedProvider.themes) {
          setThemes(updatedProvider.themes);
        }
        
        // Update image preview if new image was uploaded
        if (updatedProvider.image) {
          const imagePath = updatedProvider.image.startsWith('/storage/') 
            ? updatedProvider.image 
            : `/storage/${updatedProvider.image}`;
          setEditImagePreview(imagePath);
        } else {
          // If no image in response, keep existing preview
          if (!editImageFile) {
            setEditImagePreview(null);
          }
        }
        
        // Show success message
        alert('Profile updated successfully!');
        
        // Switch back to view mode
        setIsEditMode(false);
        setEditImageFile(null);
        setEditDocuments([]);
        setProfileUpdateError('');
        
        // Note: Provider prop will be updated by onProviderUpdate callback,
        // which will trigger useEffect to update all related state
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(', ') : '') ||
                          'Failed to update profile. Please try again.';
      setProfileUpdateError(errorMessage);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData({});
    setEditImageFile(null);
    setEditImagePreview(null);
    setEditDocuments([]);
    setProfileUpdateError('');
    setEditLocation({ lat: '', lng: '' });
    // Reset map position to provider's location or default
    if (provider?.lat && provider?.lng) {
      setMapPosition([parseFloat(provider.lat), parseFloat(provider.lng)]);
    } else {
      setMapPosition([24.8607, 67.0011]);
    }
  };

  // Change Password Handlers
  const handleOpenChangePassword = () => {
    setShowChangePassword(true);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
  };
  const handleCloseChangePassword = () => {
    setShowChangePassword(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
  };
  const handlePasswordInputChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (!provider?.id) {
      setPasswordError('Provider information is missing. Please log in again.');
      return;
    }
    setChangePasswordLoading(true);
    try {
      const res = await window.apiClient.post('/api/service-provider/change-password', {
        provider_id: provider?.id,
        old_password: passwordForm.oldPassword,
        new_password: passwordForm.newPassword,
        new_password_confirmation: passwordForm.confirmPassword,
      });
      const data = res.data;
      if (data?.error) {
        setPasswordError(data.error);
        return;
      }
      setShowChangePassword(false);
      alert('Password changed successfully!');
    } catch (err) {
      const apiError = err?.response?.data;
      if (apiError?.error) {
        setPasswordError(apiError.error);
      } else if (apiError?.errors) {
        const firstError = Object.values(apiError.errors).flat()[0];
        setPasswordError(firstError || 'An error occurred. Please try again.');
      } else {
        setPasswordError('An error occurred. Please try again.');
      }
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleSubmit = async (formData, serviceId = null) => {
    setLoading(true);
    try {
      console.log(serviceId ? 'Updating service...' : 'Creating service...');
      
      // Log the form data to verify
      const formDataEntries = {};
      for (let [key, value] of formData.entries()) {
        formDataEntries[key] = value;
      }
      console.log('Form data being sent:', formDataEntries);
      
      // Determine URL
      const url = serviceId ? `/api/provider/services/${serviceId}` : '/api/provider/services';
      
      // Try to get token from localStorage or sessionStorage
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await window.apiClient.upload(url, formData, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      
      const responseData = res.data;
      console.log('Service response:', responseData);
      
      if (responseData?.error) {
        console.error('Service operation failed:', responseData.error);
        alert(responseData.error);
        return;
      }
      
      // Update services list
      if (serviceId) {
        // Update existing service
        if (responseData?.service) {
          setServices(prev => prev.map(s => 
            s.id === serviceId ? { ...responseData.service, id: serviceId } : s
          ));
        }
        alert('Service updated successfully!');
      } else {
        // Add new service
        if (responseData && responseData.service) {
          setServices(prev => [...prev, { ...responseData.service, id: responseData.id }]);
        }
        alert('Service added successfully!');
      }
      
      setShowForm(false);
      setEditingService(null);
    } catch (error) {
      console.error('Service operation exception:', error);
      alert('An error occurred: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Draggable Marker Component for Location Editing
  const DraggableMarker = () => {
    const markerRef = useRef(null);
    const eventHandlers = {
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          handleLocationUpdate(lat, lng);
        }
      }
    };
    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={mapPosition}
        ref={markerRef}
      />
    );
  };

  // Map Click Handler
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        handleLocationUpdate(lat, lng);
      },
    });
    return null;
  };

  // Map Center Adjuster
  const MapCenterAdjuster = () => {
    const map = useMap();
    useEffect(() => {
      if (mapPosition) {
        map.setView(mapPosition, map.getZoom());
      }
    }, [mapPosition, map]);
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-600 to-blue-600 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {getInitials(provider?.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-bold text-sm truncate">{provider?.name || 'Provider'}</h2>
                  <p className="text-green-100 text-xs truncate">{provider?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:text-green-100 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <button
                onClick={() => {
                  setShowProfileView(true);
                  setIsEditMode(false);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-200 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-medium">View & Edit Profile</span>
              </button>


              <button
                onClick={() => {
                  handleOpenChangePassword();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-200 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-medium">Change Password</span>
              </button>

              <div className="pt-4 border-t border-green-500/30">
                <button
                  onClick={handleProviderLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-red-500/20 transition-all duration-200 group bg-red-500/10"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-green-500/30">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-green-100 text-xs font-medium mb-1">Provider ID</p>
                <p className="text-white text-sm font-bold">#{provider?.id}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                  <p className="text-sm text-gray-500">Welcome back, {provider?.name}</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                  <span className={`text-sm font-semibold ${provider?.is_approved ? 'text-green-700' : 'text-orange-600'}`}>
                    {provider?.is_approved ? '✅ Approved' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Profile Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                      {getInitials(provider?.name)}
                    </div>
                    <div className="flex-1 text-white">
                      <h2 className="text-2xl font-bold mb-1">{provider?.name || 'Service Provider'}</h2>
                      <p className="text-green-100">{provider?.email}</p>
                      {country && (
                        <p className="text-green-100 text-sm mt-1">📍 {country.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Your Services</h2>
                      <p className="text-gray-500 text-sm mt-1">Manage and add new services</p>
                    </div>
                    <button 
                      onClick={handleAddService} 
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add New Service
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {services && services.length > 0 ? (
                    serviceTypes.map(type => {
                      const filtered = services.filter((s) =>
                        getServiceTypesFor(s).some((st) => st.id === Number(type.id))
                      );
                      if (!filtered.length) return null;
                      return (
                        <div key={type.id} className="mb-8">
                          <h3 className="text-lg font-bold text-blue-700 mb-4">{type.name}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filtered.map(service => (
                              <div key={service.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-green-50">
                                <div className="flex items-center gap-4 mb-3">
                                  {service.image ? (
                                    <img src={`/storage/${service.image}`} alt={service.name} className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-md" />
                                  ) : (
                                    <div className="w-20 h-20 bg-gradient-to-br from-green-300 to-blue-300 flex items-center justify-center rounded-xl text-2xl font-bold text-white shadow-md">{service.name.charAt(0)}</div>
                                  )}
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 text-lg mb-1">{service.name}</h4>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {getServiceTypesFor(service).map((serviceType) => (
                                        <span key={`type-${service.id}-${serviceType.id}`} className="text-xs font-semibold px-2 py-1 bg-white text-blue-600 border border-blue-200 rounded-full">
                                          {serviceType.name}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {getThemesFor(service).length ? (
                                        getThemesFor(service).map((theme) => (
                                          <span key={`theme-${service.id}-${theme.id}`} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                            {theme.name}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="text-xs text-gray-400">No themes</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description || 'No description provided'}</p>
                                {(service.lat || service.lng) && (
                                  <>
                                    <div className="text-xs text-blue-700 mb-2 font-medium">
                                      <span>📍 Location:</span>
                                      {service.lat && <span> Lat: {parseFloat(service.lat).toFixed(6)}</span>}
                                      {service.lng && <span> | Lng: {parseFloat(service.lng).toFixed(6)}</span>}
                                    </div>
                                    <StaticMap lat={service.lat} lng={service.lng} height={120} zoom={13} />
                                  </>
                                )}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                  <span className="text-green-700 font-bold text-lg">
                                    {service.price ? `$${Number(service.price).toFixed(2)}` : 'Contact for price'}
                                  </span>
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => handleEditService(service)}
                                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                      title="Edit Service"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                      </svg>
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteService(service.id)}
                                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                      title="Delete Service"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                          <path d="M7 15h0M12 15h0M17 15h0"></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No services added yet</h3>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto">Start by adding your first service to showcase your offerings.</p>
                      <button 
                        onClick={handleAddService} 
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 mx-auto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Your First Service
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
                <button
                  onClick={handleCloseChangePassword}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <form onSubmit={handleChangePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Old Password</label>
                  <div className="relative">
                    <input
                      type={showPassword.old ? 'text' : 'password'}
                      name="oldPassword"
                      value={passwordForm.oldPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
                      required
                    />
                    <button type="button" onClick={() => togglePasswordVisibility('old')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none">
                      {showPassword.old ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.67 1.613-1.176 2.318M15.362 17.362A9.953 9.953 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.638-4.362M17.657 16.657L13.414 12.414M6.343 7.343L10.586 11.586" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
                      minLength={8}
                      required
                    />
                    <button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none">
                      {showPassword.new ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.67 1.613-1.176 2.318M15.362 17.362A9.953 9.953 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.638-4.362M17.657 16.657L13.414 12.414M6.343 7.343L10.586 11.586" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
                      minLength={8}
                      required
                    />
                    <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none">
                      {showPassword.confirm ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.67 1.613-1.176 2.318M15.362 17.362A9.953 9.953 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.638-4.362M17.657 16.657L13.414 12.414M6.343 7.343L10.586 11.586" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
                <button
                  type="submit"
                  className="w-full py-2 bg-yellow-500 text-white rounded-md font-semibold hover:bg-yellow-600 transition disabled:opacity-60"
                  disabled={changePasswordLoading}
                >
                  {changePasswordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        )}

      {/* Service Form Modal */}
      {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button 
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              {loading || !serviceTypes.length || !country ? (
                <div className="flex items-center justify-center h-40">
                  <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-green-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-green-600 font-medium">Loading form data...</span>
                  </div>
                </div>
              ) : (
                <>
                  <ServiceForm
                    serviceTypes={serviceTypes}
                    themes={themes}
                    country={country}
                    provider={provider}
                    service={editingService}
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                    loading={loading}
                  />
                </>
              )}
            </div>
          </div>
        )}

      {/* View/Edit Profile Modal */}
      {showProfileView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
              <h3 className="text-2xl font-bold text-gray-800">
                {isEditMode ? 'Edit Profile' : 'Service Provider Profile'}
              </h3>
              <div className="flex items-center gap-2">
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowProfileView(false);
                    setIsEditMode(false);
                    handleCancelEdit();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {isEditMode ? (
              // Edit Mode
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {profileUpdateError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{profileUpdateError}</p>
                  </div>
                )}

                {/* Profile Image - Edit */}
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                  <label className="block text-base font-bold text-gray-800 mb-4">Profile Image</label>
                  <div className="flex items-center gap-6">
                    {editImagePreview && (
                      <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-emerald-300 shadow-md">
                        <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setEditImageFile(e.target.files[0]);
                          }
                        }}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 transition"
                      />
                      <p className="text-xs text-gray-500 mt-2">JPG or PNG, max 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Basic Info - Edit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <div className="flex gap-2">
                      <select
                        name="country_code"
                        value={editFormData.country_code || ''}
                        onChange={handleEditFormChange}
                        className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="">Code</option>
                        {countryCodes.map((cc) => (
                          <option key={cc.code} value={cc.code}>
                            {cc.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        value={editFormData.phone || ''}
                        onChange={handleEditFormChange}
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={editFormData.website || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country <span className="text-red-500">*</span></label>
                    <select
                      name="country_id"
                      value={editFormData.country_id || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      required
                    >
                      <option value="">Select Country</option>
                      {allCountries.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range <span className="text-red-500">*</span></label>
                    <select
                      name="price_range"
                      value={editFormData.price_range || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      required
                    >
                      <option value="">Select Price Range</option>
                      <option value="$">$ (Budget)</option>
                      <option value="$$">$$ (Moderate)</option>
                      <option value="$$$">$$$ (Premium)</option>
                      <option value="$$$$">$$$$ (Luxury)</option>
                    </select>
                  </div>
                </div>

                {/* Description - Edit */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description || ''}
                    onChange={handleEditFormChange}
                    rows="4"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>

                {/* Service Types - Edit */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <label className="block text-sm font-semibold text-blue-700 mb-3">Service Types <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allServiceTypes.map(type => {
                      const isSelected = (editFormData.service_type_ids || []).includes(Number(type.id));
                      return (
                        <label key={type.id} className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-2 border-blue-200'
                        }`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleServiceTypeToggle(type.id)}
                            className="mr-2"
                          />
                          <span className="font-medium">{type.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Themes - Edit */}
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <label className="block text-sm font-semibold text-green-700 mb-3">Themes</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allThemes.map(theme => {
                      const isSelected = (editFormData.themes || []).includes(Number(theme.id));
                      return (
                        <label key={theme.id} className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                          isSelected ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border-2 border-green-200'
                        }`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleThemeToggle(theme.id)}
                            className="mr-2"
                          />
                          <span className="font-medium">{theme.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Location - Edit */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <label className="block text-sm font-semibold text-blue-700 mb-3">
                    Location - Drag the pin or click on map to set location
                  </label>
                  <div className="w-full h-64 md:h-96 border-2 border-blue-300 rounded-lg mb-3 overflow-hidden">
                    {typeof window !== 'undefined' && (
                      <MapContainer 
                        center={mapPosition} 
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
                        <MapCenterAdjuster />
                      </MapContainer>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                      <input
                        type="text"
                        name="lat"
                        value={editFormData.lat || ''}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
                        placeholder="Latitude"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                      <input
                        type="text"
                        name="lng"
                        value={editFormData.lng || ''}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
                        placeholder="Longitude"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition disabled:opacity-60"
                  >
                    {updatingProfile ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              // View Mode
              <div className="space-y-4">
                {/* Profile Image */}
                {provider?.image && (
                  <div className="flex justify-center mb-6">
                    <img 
                      src={provider.image.startsWith('/storage/') ? provider.image : `/storage/${provider.image}`}
                      alt={provider.name} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-100 shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-green-700 block mb-1">Name</label>
                    <p className="text-gray-800 font-medium">{provider?.name}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-blue-700 block mb-1">Email</label>
                    <p className="text-gray-800">{provider?.email}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-green-700 block mb-1">Phone</label>
                    <p className="text-gray-800">
                      {provider?.country_code ? `${provider.country_code} ` : ''}
                      {provider?.phone || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-blue-700 block mb-1">Website</label>
                    <a href={provider?.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {provider?.website || 'N/A'}
                    </a>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-green-700 block mb-1">Country</label>
                    <p className="text-gray-800">{country?.name || provider?.country?.name || 'N/A'}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-blue-700 block mb-1">Price Range</label>
                    <p className="text-gray-800 text-lg">{provider?.price_range || 'N/A'}</p>
                  </div>
                </div>

                {/* Service Types */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="text-sm font-semibold text-blue-700 block mb-2">Service Types</label>
                  <div className="flex flex-wrap gap-2">
                    {(provider?.service_types || provider?.serviceTypes || []).map((type) => (
                      <span key={type.id} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium">
                        {type.name}
                      </span>
                    ))}
                    {!(provider?.service_types || provider?.serviceTypes)?.length && (
                      <span className="text-gray-500">No service types assigned</span>
                    )}
                  </div>
                </div>

                {/* Themes */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <label className="text-sm font-semibold text-green-700 block mb-2">Themes</label>
                  <div className="flex flex-wrap gap-2">
                    {(provider?.themes || []).map((theme) => (
                      <span key={theme.id} className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                        {theme.name}
                      </span>
                    ))}
                    {!provider?.themes?.length && (
                      <span className="text-gray-500">No themes assigned</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Description</label>
                  <p className="text-gray-700 whitespace-pre-wrap">{provider?.description || 'No description provided'}</p>
                </div>

                {/* Location */}
                {(provider?.lat && provider?.lng) && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-green-700 block mb-2">Location</label>
                    <div className="text-gray-700 mb-3">
                      <span className="font-medium">Latitude:</span> {provider.lat}, <span className="font-medium">Longitude:</span> {provider.lng}
                    </div>
                    <StaticMap lat={provider.lat} lng={provider.lng} height={200} zoom={13} />
                  </div>
                )}

                {/* Status */}
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">Approval Status</label>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    provider?.is_approved 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {provider?.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ServiceProviderDashboard;
