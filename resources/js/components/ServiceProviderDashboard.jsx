

import React, { useState, useEffect } from 'react';
import ServiceForm from './ServiceForm';

const ServiceProviderDashboard = ({ provider }) => {
  const [showForm, setShowForm] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(null);

  useEffect(() => {
    // Fetch allowed service types for this provider
    async function fetchTypesAndCountry() {
      // In real app, provider should have serviceTypes and country populated
      // For now, fetch all types and country by id
      setLoading(true);
      try {
        let types = [];
        if (provider?.id) {
          // Fetch only allowed service types for this provider
          const res = await fetch(`/api/provider/${provider.id}/service-types`);
          types = await res.json();
        } else if (provider?.serviceTypes) {
          types = provider.serviceTypes;
        } else {
          const res = await fetch('/api/service-types');
          types = await res.json();
        }
        setServiceTypes(types);
        if (provider?.country) {
          setCountry(provider.country);
        } else if (provider?.country_id) {
          const cres = await fetch(`/api/countries`);
          const countries = await cres.json();
          setCountry(countries.find(c => c.id === provider.country_id));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchTypesAndCountry();
  }, [provider]);


  const handleAddService = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/provider/services', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        // handle error
        alert('Failed to add service');
        return;
      }
      setShowForm(false);
      // Optionally: refresh services list here
      alert('Service added!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          <div className="flex-shrink-0 flex flex-col items-center md:items-start w-full md:w-1/3">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-4xl font-bold text-white mb-4">
              {provider?.name?.charAt(0) || 'S'}
            </div>
            <h1 className="text-2xl font-bold text-green-700 mb-1 text-center md:text-left">{provider?.name || 'Service Provider'}</h1>
            <div className="text-gray-500 text-sm mb-2 text-center md:text-left">Provider ID: {provider?.id}</div>
            <div className="text-gray-700 text-sm mb-2 text-center md:text-left">{provider?.email}</div>
            <div className="flex gap-2 mt-2">
              <button className="px-4 py-1 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition text-sm">View Profile</button>
              <button className="px-4 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm">Edit Details</button>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="bg-green-50 rounded-xl p-6 shadow-inner">
              <h2 className="text-xl font-semibold text-green-700 mb-4">Your Services</h2>
              {/* Service management section will go here */}
              <div className="text-gray-500 italic">No services added yet. Use the button below to add your first service.</div>
              <button onClick={handleAddService} className="mt-6 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-bold shadow-lg hover:from-green-600 hover:to-blue-600 transition">+ Add New Service</button>
            </div>
          </div>
        </div>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
              <h3 className="text-xl font-bold text-green-700 mb-4">Add New Service</h3>
              {loading || !serviceTypes.length || !country ? (
                <div className="flex items-center justify-center h-32">
                  <span className="text-green-600 font-semibold">Loading...</span>
                </div>
              ) : (
                <ServiceForm
                  serviceTypes={serviceTypes}
                  country={country}
                  onSubmit={handleSubmit}
                  onClose={handleCloseForm}
                  loading={loading}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
