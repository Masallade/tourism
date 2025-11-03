import React, { useState, useEffect } from 'react';
import ServiceForm from './ServiceForm';
import StaticMap from './StaticMap';

const ServiceProviderDashboard = ({ provider }) => {
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
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [editingService, setEditingService] = useState(null);

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
          const cres = await window.apiClient.get(`/api/countries`);
          const countries = cres.data;
          const foundCountry = countries.find(c => c.id === provider.country_id);
          console.log('Found country by ID:', foundCountry);
          setCountry(foundCountry || { id: 1, name: 'Default Country' }); // Provide a default as fallback
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
  }, [provider]);



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
      const response = await window.apiClient.delete(`/api/provider/services/${serviceId}`);
      
      if (response.ok) {
        setServices(prev => prev.filter(s => s.id !== serviceId));
        alert('Service deleted successfully!');
      } else {
        alert('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('An error occurred while deleting the service');
    }
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
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
    setChangePasswordLoading(true);
    try {
      const res = await window.apiClient.post('/api/service-provider/change-password', {
        provider_id: provider?.id,
        old_password: passwordForm.oldPassword,
        new_password: passwordForm.newPassword,
        new_password_confirmation: passwordForm.confirmPassword,
      });
      const data = res.data;
      if (!res.ok || data.error) {
        setPasswordError(data.error || 'Failed to change password.');
        setChangePasswordLoading(false);
        return;
      }
      setShowChangePassword(false);
      alert('Password changed successfully!');
    } catch (err) {
      setPasswordError('An error occurred. Please try again.');
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
      
      // Determine URL and method
      const url = serviceId ? `/api/provider/services/${serviceId}` : '/api/provider/services';
      const method = serviceId ? 'POST' : 'POST'; // POST with _method=PUT for updates
      
      // Try to get token from localStorage or sessionStorage
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await window.apiClient.upload(url, formData, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      
      const responseData = res.data;
      console.log('Service response:', responseData);
      
      if (!res.ok) {
        let msg = serviceId ? 'Failed to update service' : 'Failed to add service';
        if (responseData && responseData.error) {
          msg = responseData.error;
        }
        console.error('Service operation failed:', msg);
        alert(msg);
        return;
      }
      
      // Update services list
      if (serviceId) {
        // Update existing service
        setServices(prev => prev.map(s => 
          s.id === serviceId ? { ...responseData.service, id: serviceId } : s
        ));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* Profile Card - Improved UI */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="border-b border-gray-100 p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-4xl font-bold text-white mb-4">
                  {getInitials(provider?.name)}
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center md:text-left">{provider?.name || 'Service Provider'}</h1>
                <div className="text-gray-500 text-sm mb-2 text-center md:text-left">Provider ID: {provider?.id}</div>
                <div className="text-gray-700 text-sm mb-4 text-center md:text-left">{provider?.email}</div>
              </div>
              <div className="flex-1 md:ml-4 flex flex-col justify-center">
                <div className="flex gap-3 mt-2 justify-center md:justify-start">
                  <button 
                    onClick={() => setShowProfileView(true)}
                    className="px-5 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition flex items-center gap-2 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Profile
                  </button>
                  <button 
                    onClick={() => setShowEditDetails(true)}
                    className="px-5 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition flex items-center gap-2 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit Details
                  </button>
                  <button
                    className="px-5 py-2 bg-yellow-500 text-white rounded-md font-medium hover:bg-yellow-600 transition flex items-center gap-2 shadow-sm"
                    onClick={handleOpenChangePassword}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 15v2"></path>
                      <path d="M9 21h6"></path>
                      <path d="M19 13A7 7 0 1 0 5 13"></path>
                      <path d="M12 9v4"></path>
                    </svg>
                    Change Password
                  </button>
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
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="p-6 bg-green-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Your Services</h2>
              <button 
                onClick={handleAddService} 
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-md font-medium hover:from-green-600 hover:to-blue-600 transition flex items-center gap-2 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add New Service
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              {services && services.length > 0 ? (
                serviceTypes.map(type => {
                  const filtered = services.filter(s => s.service_type_id === type.id);
                  if (!filtered.length) return null;
                  return (
                    <div key={type.id} className="mb-8">
                      <h3 className="text-lg font-bold text-blue-700 mb-4">{type.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map(service => (
                          <div key={service.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition bg-blue-50">
                            <div className="flex items-center gap-4 mb-2">
                              {service.image ? (
                                <img src={`/storage/${service.image}`} alt={service.name} className="w-16 h-16 object-cover rounded-md border" />
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center rounded-md text-2xl font-bold text-gray-400">{service.name.charAt(0)}</div>
                              )}
                              <div>
                                <h4 className="font-semibold text-gray-800">{service.name}</h4>
                                <div className="text-xs text-gray-500">{service.theme?.name || 'No Theme'}</div>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{service.description || 'No description provided'}</p>
                            {/* Lat/Lng display and map */}
                            {(service.lat || service.lng) && (
                              <>
                                <div className="text-xs text-blue-700 mb-2">
                                  <span className="font-semibold">Location:</span>
                                  {service.lat && (
                                    <span> Lat: {parseFloat(service.lat).toFixed(6)}</span>
                                  )}
                                  {service.lng && (
                                    <span> | Lng: {parseFloat(service.lng).toFixed(6)}</span>
                                  )}
                                </div>
                                <StaticMap lat={service.lat} lng={service.lng} height={120} zoom={13} />
                              </>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-green-700 font-bold">${service.price || '0.00'}</span>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleEditService(service)}
                                  className="p-1 text-blue-500 hover:text-blue-700 transition"
                                  title="Edit Service"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleDeleteService(service.id)}
                                  className="p-1 text-red-500 hover:text-red-700 transition"
                                  title="Delete Service"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <path d="M7 15h0M12 15h0M17 15h0"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No services added yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">Use the button below to add your first service.</p>
                  <button 
                    onClick={handleAddService} 
                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-md font-medium hover:from-green-600 hover:to-blue-600 transition flex items-center gap-2 mx-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add New Service
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Service Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
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

        {/* View Profile Modal */}
        {showProfileView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                <h3 className="text-2xl font-bold text-gray-800">Service Provider Profile</h3>
                <button
                  onClick={() => setShowProfileView(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Profile Image */}
                {provider?.image && (
                  <div className="flex justify-center mb-6">
                    <img 
                      src={`/storage/${provider.image}`} 
                      alt={provider.name} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-100 shadow-lg"
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
                    <p className="text-gray-800">{provider?.phone || 'N/A'}</p>
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
            </div>
          </div>
        )}

        {/* Edit Details Modal */}
        {showEditDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                <h3 className="text-2xl font-bold text-gray-800">Edit Provider Details</h3>
                <button
                  onClick={() => setShowEditDetails(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Edit Profile Feature</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  The edit profile feature allows you to update your provider information. This feature is currently being set up and will be available soon.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  For now, please contact the administrator to update your profile information.
                </p>
                <button
                  onClick={() => setShowEditDetails(false)}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
