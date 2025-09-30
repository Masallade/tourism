

import React, { useState, useEffect } from 'react';
import ServiceForm from './ServiceForm';

const ServiceProviderDashboard = ({ provider }) => {
  const [showForm, setShowForm] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch allowed service types, country, and all themes for this provider
    async function fetchTypesCountryThemes() {
      setLoading(true);
      try {
        let types = [];
        if (provider?.id) {
          const res = await fetch(`/api/provider/${provider.id}/service-types`);
          types = await res.json();
        } else if (provider?.serviceTypes) {
          types = provider.serviceTypes;
        } else {
          const res = await fetch('/api/service-types');
          types = await res.json();
        }
        setServiceTypes(types);
        // Only use provider's assigned themes
        if (provider?.themes) {
          setThemes(provider.themes);
        } else if (provider?.id) {
          // fallback: fetch provider with themes
          const res = await fetch(`/api/service-providers`);
          const allProviders = await res.json();
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
          const cres = await fetch(`/api/countries`);
          const countries = await cres.json();
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
            const servicesRes = await fetch(`/api/provider/${provider.id}/services`);
            if (servicesRes.ok) {
              const servicesData = await servicesRes.json();
              setServices(servicesData);
            }
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


  const handleAddService = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      console.log('Submitting service data...');
      
      // Log the form data to verify country_id is included
      const formDataEntries = {};
      for (let [key, value] of formData.entries()) {
        formDataEntries[key] = value;
      }
      console.log('Form data being sent:', formDataEntries);
      
      // Log submitted data without any fallbacks
      console.log('Submitting form data without fallbacks');
      
      // No automatic fallbacks - using only what was provided in the form
      
      // Try to get token from localStorage or sessionStorage
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/provider/services', {
        method: 'POST',
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      
      const responseData = await res.json();
      console.log('Service creation response:', responseData);
      
      if (!res.ok) {
        // Try to show backend error if available
        let msg = 'Failed to add service';
        if (responseData && responseData.error) {
          msg = responseData.error;
        }
        console.error('Service creation failed:', msg);
        alert(msg);
        return;
      }
      
      // Add the new service to the services array
      if (responseData && responseData.service) {
        setServices(prev => [...prev, responseData.service]);
      }
      
      setShowForm(false);
      alert('Service added successfully!');
    } catch (error) {
      console.error('Service creation exception:', error);
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
                  <button className="px-5 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition flex items-center gap-2 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Profile
                  </button>
                  <button className="px-5 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition flex items-center gap-2 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit Details
                  </button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(service => (
                    <div key={service.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition">
                      <h3 className="font-medium text-lg text-gray-800">{service.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{service.description || 'No description provided'}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-green-600 font-medium">${service.price || '0.00'}</span>
                        <div className="flex gap-2">
                          <button className="p-1 text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button className="p-1 text-red-500 hover:text-red-700">
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
                <h3 className="text-xl font-bold text-gray-800">Add New Service</h3>
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
                  {console.log('Provider being passed to ServiceForm:', provider)}
                  <ServiceForm
                    serviceTypes={serviceTypes}
                    themes={themes}
                    country={country}
                    provider={provider}
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                    loading={loading}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
