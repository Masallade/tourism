import React, { useState, useEffect } from 'react';

const ServiceProviderForm = ({ provider, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        country_id: '',
        name: '',
        service_type_id: '',
        description: '',
        price_range: '',
        website: '',
        email: '',
        phone: '',
        is_approved: false,
        themes: [],
    });
    const [serviceTypes, setServiceTypes] = useState([]);
    const [image, setImage] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [countries, setCountries] = useState([]);
    const [themes, setThemes] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCountries();
        fetchThemes();
        fetchServiceTypes();
        if (provider) {
            setFormData({
                country_id: provider.country_id || '',
                name: provider.name || '',
                service_type_id: provider.service_type_id || '',
                description: provider.description || '',
                price_range: provider.price_range || '',
                website: provider.website || '',
                email: (provider.email || '').toLowerCase(),
                phone: provider.phone || '',
                is_approved: provider.is_approved || false,
                themes: provider.themes?.map(t => t.id) || [],
            });
            setImage(null); // You may want to show existing image preview here
            setDocuments([]); // You may want to show existing documents here
        }
    }, [provider]);

    const fetchCountries = async () => {
        try {
            const response = await fetch('/api/countries');
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchThemes = async () => {
        try {
            const response = await fetch('/api/themes');
            const data = await response.json();
            setThemes(data);
        } catch (error) {
            console.error('Error fetching themes:', error);
        }
    };

    const fetchServiceTypes = async () => {
        try {
            const response = await fetch('/api/service-types');
            const data = await response.json();
            setServiceTypes(data);
        } catch (error) {
            console.error('Error fetching service types:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        let fieldValue = type === 'checkbox' ? checked : value;

        if (name === 'email') {
            fieldValue = fieldValue.toLowerCase();
        }

        if (name === 'image') {
            setImage(files[0]);
            return;
        }
        if (name === 'documents') {
            setDocuments(Array.from(files));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: fieldValue
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleThemeChange = (themeId) => {
        setFormData(prev => ({
            ...prev,
            themes: prev.themes.includes(themeId)
                ? prev.themes.filter(id => id !== themeId)
                : [...prev.themes, themeId]
        }));
    };

    const validateEmail = (email) => {
        if (!email) return true;
        const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/; // lowercase enforced
        return pattern.test(email);
    };

    const allowedPriceRanges = ['$', '$$', '$$$', '$$$$'];

    const validateForm = () => {
        const newErrors = {};
        if (!formData.country_id) newErrors.country_id = 'Country is required';
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.service_type_id) newErrors.service_type_id = 'Service type is required';
        if (!formData.price_range || !allowedPriceRanges.includes(formData.price_range)) {
            newErrors.price_range = 'Select a valid price range';
        }
        if (formData.email && !validateEmail(formData.email)) {
            newErrors.email = 'Enter a valid email (lowercase only)';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            const url = provider ? `/api/service-providers/${provider.id}` : '/api/service-providers';
            const method = provider ? 'PUT' : 'POST';
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'themes') {
                    value.forEach((themeId) => form.append('themes[]', themeId));
                } else {
                    form.append(key, value);
                }
            });
            if (image) {
                form.append('image', image);
            }
            if (documents.length > 0) {
                documents.forEach((doc) => form.append('documents[]', doc));
            }
            const response = await fetch(url, {
                method,
                body: form
            });
            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData.errors || {});
                return;
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving service provider:', error);
            setErrors({ general: 'An error occurred while saving the service provider' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {provider ? 'Edit Service Provider' : 'Add New Service Provider'}
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
                    {/* Image Picker */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleInputChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        {image && (
                            <div className="mt-2">
                                <span className="text-xs text-gray-500">Selected: {image.name}</span>
                            </div>
                        )}
                    </div>
                    {/* Document Uploader */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Documents (PDF, JPG, PNG)</label>
                        <input
                            type="file"
                            name="documents"
                            accept="application/pdf,image/jpeg,image/png,image/jpg"
                            multiple
                            onChange={handleInputChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        {documents.length > 0 && (
                            <div className="mt-2">
                                <span className="text-xs text-gray-500">Selected: {documents.map(doc => doc.name).join(', ')}</span>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Provider Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter service provider name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="service_type_id"
                                value={formData.service_type_id}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.service_type_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select service type</option>
                                {serviceTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                            {errors.service_type_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.service_type_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="country_id"
                                value={formData.country_id}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.country_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            {errors.country_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.country_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price Range <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="price_range"
                                value={formData.price_range}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.price_range ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select price range</option>
                                <option value="$">$ (Budget)</option>
                                <option value="$$">$$ (Moderate)</option>
                                <option value="$$$">$$$ (Premium)</option>
                                <option value="$$$$">$$$$ (Luxury)</option>
                            </select>
                            {errors.price_range && (
                                <p className="text-red-500 text-sm mt-1">{errors.price_range}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.website ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="https://example.com"
                            />
                            {errors.website && (
                                <p className="text-red-500 text-sm mt-1">{errors.website}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="contact@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="+1234567890"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter service provider description"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Themes
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {themes.map((theme) => (
                                    <label key={theme.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.themes.includes(theme.id)}
                                            onChange={() => handleThemeChange(theme.id)}
                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{theme.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_approved"
                                    checked={formData.is_approved}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700">Approve this service provider</span>
                            </label>
                        </div>
                    </div>

                    {errors.general && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                            {errors.general}
                        </div>
                    )}

                    <div className="flex justify-end mt-6 space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : (provider ? 'Update Service Provider' : 'Create Service Provider')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceProviderForm; 