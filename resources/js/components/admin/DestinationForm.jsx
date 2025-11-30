import React, { useState, useEffect } from 'react';

const DestinationForm = ({ destination, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        is_active: true,
        display_order: 0,
        service_ids: [],
        description: '',
        country_id: '',
    });
    const [images, setImages] = useState([]); // For preview and upload
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [servicesError, setServicesError] = useState(null);
    
    // Pagination states
    const [pagination, setPagination] = useState({
        total: 0,
        current_page: 1,
        per_page: 50,
        has_more: false,
        loading_more: false
    });
    
    // Filter states
    const [filters, setFilters] = useState({
        name: '',
        theme_id: '',
        service_type_id: '',
        country_id: ''
    });
    
    // Filter options
    const [themes, setThemes] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetchFilterOptions();
        // Initial fetch without filters
        fetchServices(1, true);
        
        // Also test if services exist via public endpoint (for debugging)
        const testServicesExist = async () => {
            try {
                const testRes = await window.apiClient.get('/api/services/all');
                console.log('Test: Total services in database:', testRes.data?.length || 0);
                if (testRes.data && testRes.data.length > 0) {
                    console.log('Services exist in database. Check admin authentication and API endpoint.');
                } else {
                    console.warn('No services found in database. Services need to be created first.');
                }
            } catch (error) {
                console.error('Test: Error checking services:', error);
            }
        };
        testServicesExist();
        
        if (destination) {
            setFormData({
                title: destination.title || '',
                subtitle: destination.subtitle || '',
                is_active: destination.is_active !== undefined ? destination.is_active : true,
                display_order: destination.display_order || 0,
                service_ids: destination.services ? destination.services.map(s => s.id) : [],
                description: destination.description || '',
                country_id: destination.country_id || '',
            });
            if (destination.images) {
                try {
                    const imgs = Array.isArray(destination.images) ? destination.images : JSON.parse(destination.images);
                    setImages(imgs.map(img => ({ url: `/storage/${img}`, file: null })));
                } catch {
                    setImages([]);
                }
            }
        }
    }, [destination]);

    const fetchFilterOptions = async () => {
        try {
            const [themesRes, serviceTypesRes, countriesRes] = await Promise.all([
                window.apiClient.get('/api/themes'),
                window.apiClient.get('/api/service-types'),
                window.apiClient.get('/api/countries')
            ]);
            setThemes(themesRes.data || []);
            setServiceTypes(serviceTypesRes.data || []);
            setCountries(countriesRes.data || []);
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    const fetchServices = async (page = 1, reset = false) => {
        if (reset) {
            setLoadingServices(true);
            setServices([]);
        } else {
            setPagination(prev => ({ ...prev, loading_more: true }));
        }
        
        try {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('per_page', '50');
            
            if (filters.name) params.append('name', filters.name);
            if (filters.theme_id) params.append('theme_id', filters.theme_id);
            if (filters.service_type_id) params.append('service_type_id', filters.service_type_id);
            if (filters.country_id) params.append('country_id', filters.country_id);
            
            const url = '/api/admin/destinations/services?' + params.toString();
            console.log('Fetching services from:', url);
            console.log('Current filters:', filters);
            
            const response = await window.apiClient.get(url);
            console.log('Full response:', response);
            console.log('Response data:', response.data);
            console.log('Response status:', response.status);
            
            const responseData = response.data || {};
            
            // Handle both paginated and non-paginated responses
            let servicesData = [];
            if (Array.isArray(responseData)) {
                // Direct array response (fallback)
                servicesData = responseData;
                console.warn('Received array response instead of paginated object');
            } else if (Array.isArray(responseData.data)) {
                // Paginated response
                servicesData = responseData.data;
            } else {
                console.error('Unexpected response format:', responseData);
            }
            
            console.log('Parsed services data:', servicesData);
            console.log('Services count:', servicesData.length);
            
            setServicesError(null); // Clear any previous errors
            
            if (reset) {
                setServices(servicesData);
            } else {
                // Append new services to existing list
                setServices(prev => [...prev, ...servicesData]);
            }
            
            // Update pagination info
            setPagination({
                total: responseData.total || servicesData.length,
                current_page: responseData.current_page || page,
                per_page: responseData.per_page || 50,
                has_more: responseData.has_more !== undefined ? responseData.has_more : (servicesData.length >= 50)
            });
            
            if (servicesData.length === 0 && page === 1 && !filters.name && !filters.theme_id && !filters.service_type_id && !filters.country_id) {
                console.warn('No services found in database. Make sure services exist.');
                console.warn('Try checking: 1) Are there services in the database? 2) Is the API endpoint working? 3) Check browser network tab for API response');
                setServicesError('No services found. Services need to be created by service providers first.');
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            console.error('Error message:', error.message);
            
            if (reset) {
                setServices([]);
            }
            
            // Set user-friendly error message
            if (error.response?.status === 401) {
                setServicesError('Authentication required. Please log in again.');
            } else if (error.response?.status === 403) {
                setServicesError('Permission denied. Admin access required.');
            } else if (error.response?.status === 404) {
                setServicesError('API endpoint not found. Please check configuration.');
            } else if (error.response?.status === 500) {
                setServicesError('Server error. Please check server logs.');
            } else {
                setServicesError(`Error loading services: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setLoadingServices(false);
            setPagination(prev => ({ ...prev, loading_more: false }));
        }
    };

    // Refetch services when filters change (reset to page 1)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchServices(1, true); // Reset to page 1 and clear existing services
        }, 300); // Debounce for name filter
        
        return () => clearTimeout(timeoutId);
    }, [filters.name, filters.theme_id, filters.service_type_id, filters.country_id]);

    const loadMoreServices = () => {
        if (!pagination.loading_more && pagination.has_more) {
            fetchServices(pagination.current_page + 1, false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'display_order' ? parseInt(value) || 0 : value)
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const toggleService = (serviceId) => {
        setFormData(prev => ({
            ...prev,
            service_ids: prev.service_ids.includes(serviceId)
                ? prev.service_ids.filter(id => id !== serviceId)
                : [...prev.service_ids, serviceId]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const payload = new FormData();
            payload.append('title', formData.title.trim());
            payload.append('subtitle', formData.subtitle.trim());
            payload.append('is_active', formData.is_active ? '1' : '0');
            payload.append('display_order', formData.display_order);
            payload.append('description', formData.description);
            payload.append('country_id', formData.country_id);
            formData.service_ids.forEach(id => payload.append('service_ids[]', id));
            // Only send new image files (file !== null)
            images.filter(img => img.file).forEach((img) => {
                payload.append('images[]', img.file);
            });
            if (destination) {
                await window.apiClient.put(`/api/admin/destinations/${destination.id}`, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await window.apiClient.post('/api/admin/destinations', payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving destination:', error);
            if (error.response) {
                // Show full error details for debugging
                setErrors({
                    ...error.response.data?.errors,
                    debug: JSON.stringify(error.response.data, null, 2)
                });
            } else {
                setErrors({ general: 'An error occurred while saving the destination' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Client-side filtering by search term (additional to server-side filters)
    const filteredServices = services.filter(service =>
        !searchTerm || 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        setSearchTerm(''); // Clear search term when filter changes
    };

    const clearFilters = () => {
        setFilters({
            name: '',
            theme_id: '',
            service_type_id: '',
            country_id: ''
        });
        setSearchTerm('');
        // The useEffect will automatically refetch when filters change
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                        {destination ? 'Edit Destination' : 'Add New Destination'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., Explore experiences near Lahore"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subtitle
                            </label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., Can't-miss picks near you"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Add a description for this destination"
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Country Dropdown (for destination) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="country_id"
                                value={formData.country_id}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            >
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>{country.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Images Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Images (max 5)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={e => {
                                    const files = Array.from(e.target.files);
                                    let newImages = [...images];
                                    files.forEach(file => {
                                        if (newImages.length < 5) {
                                            newImages.push({ file, url: URL.createObjectURL(file) });
                                        }
                                    });
                                    setImages(newImages.slice(0, 5));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={images.length >= 5}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                                        <img src={img.url} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full" />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                            onClick={() => {
                                                setImages(images.filter((_, i) => i !== idx));
                                            }}
                                            title="Remove image"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {images.length >= 5 && (
                                <p className="text-xs text-gray-500 mt-1">Maximum 5 images allowed.</p>
                            )}
                        </div>
                       

                        {/* Display Order */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    name="display_order"
                                    value={formData.display_order}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-end">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Active</span>
                                </label>
                            </div>
                        </div>

                        {/* Services Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Select Services 
                                    <span className="text-gray-500 text-xs ml-2">
                                        ({formData.service_ids.length} selected
                                        {!loadingServices && pagination.total > 0 && ` • ${filteredServices.length} of ${pagination.total} shown`})
                                    </span>
                                </label>
                                {(filters.name || filters.theme_id || filters.service_type_id || filters.country_id) && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                            
                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                                {/* Name Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Search by Name</label>
                                    <input
                                        type="text"
                                        placeholder="Service name..."
                                        value={filters.name}
                                        onChange={(e) => handleFilterChange('name', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Theme Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Filter by Theme</label>
                                    <select
                                        value={filters.theme_id}
                                        onChange={(e) => handleFilterChange('theme_id', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">All Themes</option>
                                        {themes.map(theme => (
                                            <option key={theme.id} value={theme.id}>{theme.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Service Type Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Filter by Service Type</label>
                                    <select
                                        value={filters.service_type_id}
                                        onChange={(e) => handleFilterChange('service_type_id', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">All Service Types</option>
                                        {serviceTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Country Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Filter by Country</label>
                                    <select
                                        value={filters.country_id}
                                        onChange={(e) => handleFilterChange('country_id', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">All Countries</option>
                                        {countries.map(country => (
                                            <option key={country.id} value={country.id}>{country.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Additional Search (for client-side filtering within filtered results) */}
                            {filteredServices.length > 0 && (
                                <input
                                    type="text"
                                    placeholder="Quick search in results..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
                                />
                            )}

                            {/* Services List */}
                            <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                                {servicesError && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-md m-2">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-red-800">{servicesError}</p>
                                                <p className="text-xs text-red-600 mt-1">Check browser console for details.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {loadingServices ? (
                                    <div className="p-4 text-center text-gray-500">
                                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                                        <p className="mt-2">Loading services...</p>
                                    </div>
                                ) : filteredServices.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        <p className="font-medium mb-2">No services found</p>
                                        {(filters.name || filters.theme_id || filters.service_type_id || filters.country_id) ? (
                                            <>
                                                <p className="text-sm mb-2">Try clearing filters to see all services</p>
                                                <button
                                                    type="button"
                                                    onClick={clearFilters}
                                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                                                >
                                                    Clear filters to see all services
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm mb-2">No services are available in the database.</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Services need to be created by service providers first.
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Check browser console (F12) for debugging information.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200">
                                        {filteredServices.map((service) => {
                                            const isSelected = formData.service_ids.includes(service.id);
                                            return (
                                                <label
                                                    key={service.id}
                                                    className={`flex items-start p-3 hover:bg-gray-50 cursor-pointer ${
                                                        isSelected ? 'bg-green-50' : ''
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleService(service.id)}
                                                        className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                    />
                                                    <div className="ml-3 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-gray-900">{service.name}</span>
                                                            {service.price && (
                                                                <span className="text-sm text-green-600 font-semibold">${service.price}</span>
                                                            )}
                                                        </div>
                                                        {service.description && (
                                                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{service.description}</p>
                                                        )}
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {(service.service_types || service.serviceTypes || []).slice(0, 2).map((type) => (
                                                                <span key={type.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                                    {type.name}
                                                                </span>
                                                            ))}
                                                            {service.country && (
                                                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                                                    {service.country.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                                
                                {/* View More Button */}
                                {!loadingServices && filteredServices.length > 0 && pagination.has_more && (
                                    <div className="p-4 text-center border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={loadMoreServices}
                                            disabled={pagination.loading_more}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center mx-auto"
                                        >
                                            {pagination.loading_more ? (
                                                <>
                                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    View More ({pagination.total - filteredServices.length} remaining)
                                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Showing {filteredServices.length} of {pagination.total} services
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {errors.general && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                                {errors.general}
                            </div>
                        )}

                        <div className="flex justify-end mt-6 space-x-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : (destination ? 'Update Destination' : 'Create Destination')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DestinationForm;
