import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Marker component with position tracking
const DraggableMarker = ({ position }) => {
    const markerRef = useRef(null);
    const { updateLocationData } = React.useContext(LocationContext);

    const eventHandlers = {
        dragend() {
            const marker = markerRef.current;
            if (marker != null) {
                const { lat, lng } = marker.getLatLng();
                updateLocationData(lat, lng);
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

// Component to update map center when position changes
const MapCenterAdjuster = ({ position }) => {
    const map = useMap();
    
    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom());
        }
    }, [position, map]);
    
    return null;
};

// Create context for sharing location update function
const LocationContext = React.createContext({});

// Map click handler component
const MapClickHandler = () => {
    const { updateLocationData } = React.useContext(LocationContext);
    
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            updateLocationData(lat, lng);
        },
    });
    return null;
};

// Add showApproveCheckbox prop and onBack prop
const ServiceProviderForm = ({ provider, onClose, onSuccess, showApproveCheckbox = false, onBack = null }) => {
    const [formData, setFormData] = useState({
        country_id: '',
        name: '',
        service_type_ids: [],
        description: '',
        price_range: '',
        website: '',
        email: '',
        phone: '',
        is_approved: false,
        themes: [],
        lat: '',
        lng: '',
    });

    
    const [position, setPosition] = useState([25.276987, 55.296249]); // Default position (Dubai)
    
    // Function to update both position and form data
    const updateLocationData = (lat, lng) => {
        setPosition([lat, lng]);
        setFormData(prev => ({
            ...prev,
            lat: lat.toFixed(7),
            lng: lng.toFixed(7)
        }));
        
        // Clear location error if it exists
        if (errors.location) {
            setErrors(prev => ({
                ...prev,
                location: ''
            }));
        }
    };
    const [serviceTypes, setServiceTypes] = useState([]);
    const [image, setImage] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [countries, setCountries] = useState([]);
    const [themes, setThemes] = useState([]);
    const [errors, setErrors] = useState({});
    const [summaryError, setSummaryError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // We handle form data updates directly in updateLocationData
    
    // We don't need this effect anymore as we handle position updates in updateLocationData and handleInputChange

    useEffect(() => {
        fetchCountries();
        fetchThemes();
        fetchServiceTypes();
        
        if (provider) {
            // Update position if provider has coordinates
            if (provider.lat && provider.lng) {
                setPosition([parseFloat(provider.lat), parseFloat(provider.lng)]);
            }
            
            // Use snake_case (service_types) because that's how Laravel returns it
            const serviceTypesData = provider.service_types || provider.serviceTypes || [];
            const serviceTypeIds = serviceTypesData.map(st => Number(st.id));
            
            setFormData({
                country_id: provider.country_id || '',
                name: provider.name || '',
                service_type_ids: serviceTypeIds,
                description: provider.description || '',
                price_range: provider.price_range || '',
                website: provider.website || '',
                email: (provider.email || '').toLowerCase(),
                phone: provider.phone || '',
                is_approved: provider.is_approved || false,
                themes: provider.themes?.map(t => Number(t.id)) || [],
                lat: provider.lat || '',
                lng: provider.lng || '',
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
        const { name, value, type, checked, files, multiple, options } = e.target;
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

        // Handle multi-select for service_type_ids
        if (name === 'service_type_ids' && multiple) {
            fieldValue = Array.from(options).filter(opt => opt.selected).map(opt => opt.value);
        }
        
        // Handle lat/lng changes
        if (name === 'lat' || name === 'lng') {
            // Only update if it's a valid number or empty
            if (fieldValue === '' || !isNaN(parseFloat(fieldValue))) {
                setFormData(prev => ({
                    ...prev,
                    [name]: fieldValue
                }));
                
                // Update position state if both lat and lng are valid
                const lat = name === 'lat' ? parseFloat(fieldValue) : parseFloat(formData.lat);
                const lng = name === 'lng' ? parseFloat(fieldValue) : parseFloat(formData.lng);
                
                if (!isNaN(lat) && !isNaN(lng)) {
                    setPosition([lat, lng]);
                }
                
                // Clear location error if it exists
                if (errors.location) {
                    setErrors(prev => ({
                        ...prev,
                        location: ''
                    }));
                }
            }
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

    const handleServiceTypeChange = (serviceTypeId) => {
        setFormData(prev => ({
            ...prev,
            service_type_ids: prev.service_type_ids.includes(serviceTypeId)
                ? prev.service_type_ids.filter(id => id !== serviceTypeId)
                : [...prev.service_type_ids, serviceTypeId]
        }));
        
        // Clear error if exists
        if (errors.service_type_ids) {
            setErrors(prev => ({
                ...prev,
                service_type_ids: ''
            }));
        }
    };


    // Validation helpers
    const validateEmail = (email) => {
        if (!email) return true;
        const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/; // lowercase enforced
        return pattern.test(email);
    };
    const validateURL = (url) => {
        if (!url) return true;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };
    const validatePhone = (phone) => {
        if (!phone) return true;
        // Only digits allowed, min 7, max 15
        const pattern = /^\d{7,15}$/;
        return pattern.test(phone);
    };
    const allowedPriceRanges = ['$', '$$', '$$$', '$$$$'];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const allowedDocTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    const validateForm = () => {
        const newErrors = {};
        // Name
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        } else if (formData.name.length > 100) {
            newErrors.name = 'Name must be less than 100 characters';
        } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
            newErrors.name = 'Name can only contain letters and spaces';
        }
        // Service Type
        if (!formData.service_type_ids || formData.service_type_ids.length === 0) {
            newErrors.service_type_ids = 'At least one service type is required';
        }
        // Country
        if (!formData.country_id) {
            newErrors.country_id = 'Country is required';
        }
        // Location
        if (!formData.lat || !formData.lng) {
            newErrors.location = 'Please select a location on the map';
        }
        // Price Range
        if (!formData.price_range || !allowedPriceRanges.includes(formData.price_range)) {
            newErrors.price_range = 'Select a valid price range';
        }
        // Website (required and must be valid)
        if (!formData.website.trim()) {
            newErrors.website = 'Website is required';
        } else if (!validateURL(formData.website)) {
            newErrors.website = 'Enter a valid website URL (https://...)';
        }
        // Email (required and must be valid)
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Enter a valid email (lowercase only)';
        }
        // Phone (required and must be valid)
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Enter a valid phone number';
        }
        // Description
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        } else if (formData.description.length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }
        // Image (required for new, optional for edit)
        if (!provider && !image) {
            newErrors.image = 'Profile image is required';
        } else if (image && !allowedImageTypes.includes(image.type)) {
            newErrors.image = 'Image must be JPG or PNG';
        }
        // Documents (at least one required, all must be valid type)
        if (documents.length === 0) {
            newErrors.documents = 'At least one document is required';
        } else if (documents.some(doc => !allowedDocTypes.includes(doc.type))) {
            newErrors.documents = 'Documents must be PDF, JPG, or PNG';
        }
        setErrors(newErrors);
        
        // Scroll to first error if validation fails
        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0];
            const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                errorElement.focus();
            }
        }
        
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSummaryError(''); // Always clear summary error on submit
        if (!validateForm()) {
            return;
        }
        // Ensure service_type_id is not empty string
        if (!formData.service_type_ids || formData.service_type_ids.length === 0) {
            setErrors(prev => ({ ...prev, service_type_ids: 'At least one service type is required' }));
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
                } else if (key === 'service_type_ids') {
                    value.forEach((typeId) => form.append('service_type_ids[]', typeId));
                } else if (key === 'is_approved') {
                    if (showApproveCheckbox) {
                        form.append('is_approved', value ? 1 : 0);
                    } else {
                        form.append('is_approved', 0);
                    }
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
                
                // Scroll to first error field
                if (errorData.errors) {
                    const firstErrorField = Object.keys(errorData.errors)[0];
                    const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
                    if (errorElement) {
                        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        errorElement.focus();
                    }
                }
                
                // Show all unique field errors in summary if present
                if (errorData.errors) {
                    let summary = [];
                    if (errorData.errors.email && errorData.errors.email[0].includes('already registered')) {
                        summary.push('Email is already registered.');
                    }
                    if (errorData.errors.phone && errorData.errors.phone[0].includes('already registered')) {
                        summary.push('Phone number is already registered.');
                    }
                    if (errorData.errors.website && errorData.errors.website[0].includes('already registered')) {
                        summary.push('Website is already registered.');
                    }
                    setSummaryError(summary.join(' '));
                } else {
                    setSummaryError('');
                }
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
    <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-white to-blue-100 bg-opacity-80 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-0 w-full max-w-3xl shadow-2xl rounded-2xl bg-white max-h-[95vh] overflow-y-auto border-0">
                <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-t-2xl">
                    <h3 className="text-2xl font-bold text-green-700 tracking-tight">
                        {provider ? 'Edit Service Provider' : 'Add New Service Provider'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-green-600 transition-colors duration-200 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                        title="Close"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="px-8 py-6 space-y-6">
                    {summaryError && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-sm text-center font-semibold">
                            {summaryError}
                        </div>
                    )}
                    {/* Image Picker */}
                    <div className="mb-4 flex flex-col md:flex-row gap-6 items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-green-700 mb-2">Profile Image</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={handleInputChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition"
                            />
                            {image && (
                                <div className="mt-2">
                                    <span className="text-xs text-gray-500">Selected: {image.name}</span>
                                </div>
                            )}
                            {errors.image && (
                                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-green-700 mb-2">Documents (PDF, JPG, PNG)</label>
                            <input
                                type="file"
                                name="documents"
                                accept="application/pdf,image/jpeg,image/png,image/jpg"
                                multiple
                                onChange={handleInputChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
                            />
                            {documents.length > 0 && (
                                <div className="mt-2">
                                    <span className="text-xs text-gray-500">Selected: {documents.map(doc => doc.name).join(', ')}</span>
                                </div>
                            )}
                            {errors.documents && (
                                <p className="text-red-500 text-sm mt-1">{errors.documents}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-green-700 mb-2">
                                Service Provider Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 text-green-900 placeholder:text-green-400 font-medium shadow-sm transition ${
                                    errors.name ? 'border-red-400' : 'border-green-200'
                                }`}
                                placeholder="Enter service provider name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-blue-700 mb-2">
                                Service Type <span className="text-red-500">*</span>
                            </label>
                            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 rounded-lg border-2 ${
                                errors.service_type_ids ? 'border-red-400 bg-red-50' : 'border-blue-200 bg-blue-50'
                            }`}>
                                {serviceTypes.map((type) => {
                                    const typeId = Number(type.id);
                                    const isChecked = formData.service_type_ids.includes(typeId);
                                    return (
                                        <label key={type.id} className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer border border-blue-200">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleServiceTypeChange(typeId)}
                                                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-blue-900 font-medium">{type.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                            {errors.service_type_ids && (
                                <p className="text-red-500 text-sm mt-1">{errors.service_type_ids}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-green-700 mb-2">
                                Country <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="country_id"
                                value={formData.country_id}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 text-green-900 placeholder:text-green-400 font-medium shadow-sm transition ${
                                    errors.country_id ? 'border-red-400' : 'border-green-200'
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
                            <label className="block text-sm font-semibold text-green-700 mb-2">
                                Price Range <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="price_range"
                                value={formData.price_range}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 text-green-900 placeholder:text-green-400 font-medium shadow-sm transition ${
                                    errors.price_range ? 'border-red-400' : 'border-green-200'
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
                            <label className="block text-sm font-semibold text-blue-700 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder:text-blue-400 font-medium shadow-sm transition ${
                                    errors.website ? 'border-red-400' : 'border-blue-200'
                                }`}
                                placeholder="https://example.com"
                            />
                            {errors.website && (
                                <p className="text-red-500 text-sm mt-1">{errors.website}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-blue-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder:text-blue-400 font-medium shadow-sm transition ${
                                    errors.email ? 'border-red-400' : 'border-blue-200'
                                }`}
                                placeholder="contact@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-blue-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData(prev => ({ ...prev, phone: val }));
                                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                                }}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder:text-blue-400 font-medium shadow-sm transition ${errors.phone ? 'border-red-400' : 'border-blue-200'}`}
                                placeholder="Enter phone number (digits only)"
                                maxLength={15}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-green-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 text-green-900 placeholder:text-green-400 font-medium shadow-sm transition ${errors.description ? 'border-red-400' : 'border-green-200'}`}
                                placeholder="Enter service provider description"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>
                        
                        <div className="md:col-span-2 mb-6">
                            <label className="block text-sm font-semibold text-blue-700 mb-2">
                                Location - Drag the pin or click on map to set location <span className="text-red-500">*</span>
                            </label>
                            
                            <div className="w-full h-64 md:h-96 border-2 border-blue-200 rounded-lg mb-3 overflow-hidden">
                                {typeof window !== 'undefined' && (
                                    <LocationContext.Provider value={{ updateLocationData }}>
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
                                            <DraggableMarker position={position} />
                                            <MapClickHandler />
                                            <MapCenterAdjuster position={position} />
                                        </MapContainer>
                                    </LocationContext.Provider>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                                    <input
                                        type="text"
                                        name="lat"
                                        value={formData.lat}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 ${
                                            errors.location ? 'border-red-400' : 'border-blue-200'
                                        }`}
                                        placeholder="Latitude"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                                    <input
                                        type="text"
                                        name="lng"
                                        value={formData.lng}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 ${
                                            errors.location ? 'border-red-400' : 'border-blue-200'
                                        }`}
                                        placeholder="Longitude"
                                    />
                                </div>
                            </div>
                            {errors.location && (
                                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-green-700 mb-2">
                                Themes
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {themes.map((theme) => (
                                    <label key={theme.id} className="flex items-center bg-green-50 rounded-lg px-2 py-1 shadow-sm hover:bg-green-100 transition cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.themes.includes(Number(theme.id))}
                                            onChange={() => handleThemeChange(Number(theme.id))}
                                            className="rounded border-green-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="ml-2 text-sm text-green-700 font-medium">{theme.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {showApproveCheckbox && (
                            <div className="md:col-span-2 mt-2">
                                <label className="flex items-center bg-blue-50 rounded-lg px-3 py-2 shadow-sm">
                                    <input
                                        type="checkbox"
                                        name="is_approved"
                                        checked={formData.is_approved}
                                        onChange={handleInputChange}
                                        className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm font-semibold text-blue-700">Approve this service provider</span>
                                </label>
                            </div>
                        )}
                    </div>

                    {errors.general && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-sm">
                            {errors.general}
                        </div>
                    )}

                    <div className="flex justify-between mt-8">
                        {onBack && (
                            <button
                                type="button"
                                onClick={onBack}
                                className="px-6 py-2 text-base font-semibold text-blue-700 bg-blue-100 border-2 border-blue-300 rounded-lg hover:bg-blue-200 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Go Back
                            </button>
                        )}
                        <div className={`flex space-x-4 ${!onBack ? 'ml-auto' : ''}`}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-base font-semibold text-green-700 bg-green-100 border-2 border-green-300 rounded-lg hover:bg-green-200 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 text-base font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 border-0 rounded-lg shadow-md hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-60 transition"
                            >
                                {isSubmitting ? 'Saving...' : (provider ? 'Update Service Provider' : 'Create Service Provider')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceProviderForm;