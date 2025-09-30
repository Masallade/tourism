
import React, { useState } from 'react';

const ServiceForm = ({ serviceTypes, themes = [], country, provider, onSubmit, onClose, loading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [serviceTypeId, setServiceTypeId] = useState(serviceTypes[0]?.id || '');
  const [themeId, setThemeId] = useState(themes[0]?.id || '');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Service name is required.');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description || '');
    formData.append('price', price || '');
    formData.append('service_type_id', serviceTypeId);
    formData.append('theme_id', themeId);
    formData.append('country_id', country?.id);
    formData.append('provider_id', provider?.id)
    // All other fields will be handled on the backend
    if (image) formData.append('image', image);
    onSubmit(formData);
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Service Type Field */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Service Type</label>
          <div className="relative">
            <select 
              className="appearance-none w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white" 
              value={serviceTypeId} 
              onChange={e => setServiceTypeId(e.target.value)} 
              required
            >
              {serviceTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Theme Field */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Theme</label>
          <div className="relative">
            <select 
              className="appearance-none w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white" 
              value={themeId} 
              onChange={e => setThemeId(e.target.value)} 
              required
            >
              {themes.map(theme => (
                <option key={theme.id} value={theme.id}>{theme.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
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
      
      {/* Image Upload Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Service Image</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full border-2 border-gray-200 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            {imagePreview ? (
              <div className="relative w-full p-1">
                <img 
                  src={imagePreview} 
                  alt="Image preview" 
                  className="h-56 w-full object-cover rounded-md"
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
                <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
          </label>
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
              Add Service
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
