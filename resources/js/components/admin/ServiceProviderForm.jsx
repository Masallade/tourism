import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/config';
import { countryCodes } from '../../utils/countryCodes';
import { compressImage, compressImages, getCompressionSettings } from '../../utils/imageCompression';
import SubscriptionSelection from '../SubscriptionSelection';
import PaymentForm from '../PaymentForm';
import PaymentSuccess from '../PaymentSuccess';
import RichTextEditor from '../RichTextEditor';

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
    const { t } = useTranslation();
    
    // Subscription & Payment Flow States
    const [showSubscriptionFlow, setShowSubscriptionFlow] = useState(false);
    const [flowStep, setFlowStep] = useState('form'); // 'form', 'subscription', 'payment', 'success'
    const [createdProviderId, setCreatedProviderId] = useState(null);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    // Initialize formData synchronously with provider data if available
    const getInitialFormData = () => {
        if (provider) {
            const serviceTypesData = provider.service_types || provider.serviceTypes || [];
            const serviceTypeIds = serviceTypesData.map(st => Number(st.id)).filter(id => !isNaN(id) && id > 0);
            const countryId = provider.country_id;
            const finalCountryId = (countryId !== null && countryId !== undefined && countryId !== '') 
                ? Number(countryId) 
                : '';
            
            return {
                country_id: finalCountryId,
                name: String(provider.name || '').trim(),
                service_type_ids: serviceTypeIds.length > 0 ? serviceTypeIds : [],
                description: String(provider.description || '').trim(),
                price_range: String(provider.price_range || '').trim(),
                website: String(provider.website || '').trim(),
                email: String(provider.email || '').toLowerCase().trim(),
                phone: String(provider.phone || '').trim(),
                is_approved: Boolean(provider.is_approved),
                themes: provider.themes?.map(t => Number(t.id)).filter(id => !isNaN(id) && id > 0) || [],
                lat: provider.lat ? String(provider.lat).trim() : '',
                lng: provider.lng ? String(provider.lng).trim() : '',
            };
        }
        return {
        country_id: '',
        name: '',
        service_type_ids: [],
        description: '',
        price_range: '',
        website: '',
        email: '',
        phone: '',
        country_code: '',
        is_approved: false,
        themes: [],
        lat: '',
        lng: '',
        };
    };

    const [formData, setFormData] = useState(getInitialFormData);
    
    const [position, setPosition] = useState(() => {
        if (provider?.lat && provider?.lng) {
            return [parseFloat(provider.lat), parseFloat(provider.lng)];
        }
        return [25.276987, 55.296249]; // Default position (Dubai)
    });
    
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
    const [existingImage, setExistingImage] = useState(null); // For displaying existing image
    const [documents, setDocuments] = useState([]);
    const [existingDocuments, setExistingDocuments] = useState([]); // For displaying existing documents
    const [countries, setCountries] = useState([]);
    const [themes, setThemes] = useState([]);
    const [errors, setErrors] = useState({});
    const [summaryError, setSummaryError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Location search state
    const [locationSearchQuery, setLocationSearchQuery] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const locationSearchTimeoutRef = useRef(null);

    // We handle form data updates directly in updateLocationData
    
    // We don't need this effect anymore as we handle position updates in updateLocationData and handleInputChange


    // Close location suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.location-search-container')) {
                setShowLocationSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchCountries();
        fetchThemes();
        fetchServiceTypes();
    }, []);

    // Refetch themes and service types when language changes
    useEffect(() => {
        const handleLanguageChange = () => {
            fetchThemes();
            fetchServiceTypes();
        };
        
        i18n.on('languageChanged', handleLanguageChange);
        
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    useEffect(() => {
        if (provider) {
            // Update position if provider has coordinates
            if (provider.lat && provider.lng) {
                setPosition([parseFloat(provider.lat), parseFloat(provider.lng)]);
            }
            
            // Use snake_case (service_types) because that's how Laravel returns it
            const serviceTypesData = provider.service_types || provider.serviceTypes || [];
            const serviceTypeIds = serviceTypesData.map(st => Number(st.id)).filter(id => !isNaN(id) && id > 0);
            
            // Ensure country_id is a number, not empty string
            const countryId = provider.country_id;
            const finalCountryId = (countryId !== null && countryId !== undefined && countryId !== '') 
                ? Number(countryId) 
                : '';
            
            console.log('Initializing form with provider data:', {
                provider_id: provider.id,
                country_id: countryId,
                final_country_id: finalCountryId,
                name: provider.name,
                price_range: provider.price_range,
                service_type_ids: serviceTypeIds,
                service_types_data: serviceTypesData
            });
            
            // Ensure all values are properly formatted
            const initializedFormData = {
                country_id: finalCountryId,
                name: String(provider.name || '').trim(),
                service_type_ids: serviceTypeIds.length > 0 ? serviceTypeIds : [],
                description: String(provider.description || '').trim(),
                price_range: String(provider.price_range || '').trim(),
                website: String(provider.website || '').trim(),
                email: String(provider.email || '').toLowerCase().trim(),
                phone: String(provider.phone || '').trim(),
                is_approved: Boolean(provider.is_approved),
                themes: provider.themes?.map(t => Number(t.id)).filter(id => !isNaN(id) && id > 0) || [],
                lat: provider.lat ? String(provider.lat).trim() : '',
                lng: provider.lng ? String(provider.lng).trim() : '',
            };
            
            console.log('Setting formData:', initializedFormData);
            
            setFormData(initializedFormData);
            setImage(null); // New image file (if user selects one)
            
            // Set existing image for display
            if (provider.image) {
                setExistingImage(provider.image);
            } else {
                setExistingImage(null);
            }
            
            // Set existing documents for display
            if (provider.documents && Array.isArray(provider.documents) && provider.documents.length > 0) {
                setExistingDocuments(provider.documents);
            } else {
                setExistingDocuments([]);
            }
            
            setDocuments([]); // New documents (if user selects any)
            // Clear any existing errors when loading provider data
            setErrors({});
            setSummaryError('');
        }
    }, [provider]);

    const fetchCountries = async () => {
        try {
            const response = await window.apiClient.get('/api/countries');
            setCountries(response.data);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchThemes = async () => {
        try {
            const response = await window.apiClient.get('/api/themes');
            setThemes(response.data);
        } catch (error) {
            console.error('Error fetching themes:', error);
        }
    };

    const fetchServiceTypes = async () => {
        try {
            const response = await window.apiClient.get('/api/service-types');
            setServiceTypes(response.data);
        } catch (error) {
            console.error('Error fetching service types:', error);
        }
    };

    // Location search functions
    const fetchLocationSuggestions = async (query) => {
        if (!query || query.length < 2) {
            setLocationSuggestions([]);
            setShowLocationSuggestions(false);
            return;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
            );
            const data = await response.json();
            setLocationSuggestions(data || []);
            setShowLocationSuggestions(true);
        } catch (error) {
            console.error('Error fetching location suggestions:', error);
            setLocationSuggestions([]);
        }
    };

    const handleLocationSearchChange = (e) => {
        const query = e.target.value;
        setLocationSearchQuery(query);
        
        // Clear existing timeout
        if (locationSearchTimeoutRef.current) {
            clearTimeout(locationSearchTimeoutRef.current);
        }
        
        // Debounce the search
        if (query.length >= 2) {
            locationSearchTimeoutRef.current = setTimeout(() => {
                fetchLocationSuggestions(query);
            }, 300);
        } else {
            setLocationSuggestions([]);
            setShowLocationSuggestions(false);
        }
    };

    const handleLocationSelect = async (locationData) => {
        setShowLocationSuggestions(false);
        setIsGeocoding(true);
        
        try {
            let location;
            
            // If locationData is already an object (from suggestion click)
            if (typeof locationData === 'object' && locationData.lat) {
                location = {
                    lat: parseFloat(locationData.lat),
                    lng: parseFloat(locationData.lon),
                    name: locationData.display_name
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
                        name: bestResult.display_name
                    };
                }
            }
            
            if (location) {
                updateLocationData(location.lat, location.lng);
                setLocationSearchQuery(location.name);
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleLocationSearchKeyDown = (e) => {
        if (e.key === 'Enter' && locationSearchQuery.trim()) {
            e.preventDefault();
            handleLocationSelect(locationSearchQuery);
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
            // Hide existing image when new one is selected
            if (files[0]) {
                setExistingImage(null);
            }
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
        
        // Handle country_id - convert to number or empty string
        if (name === 'country_id') {
            const numValue = fieldValue === '' ? '' : Number(fieldValue);
            setFormData(prev => ({
                ...prev,
                [name]: numValue
            }));
            
            if (errors[name]) {
                setErrors(prev => ({
                    ...prev,
                    [name]: ''
                }));
            }
            return;
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
        // Ensure serviceTypeId is a number
        const numId = Number(serviceTypeId);
        
        setFormData(prev => {
            // Ensure all IDs in the array are numbers for proper comparison
            const currentIds = prev.service_type_ids.map(id => Number(id));
            const isChecked = currentIds.includes(numId);
            
            return {
            ...prev,
                service_type_ids: isChecked
                    ? currentIds.filter(id => id !== numId)
                    : [...currentIds, numId]
            };
        });
        
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

        // Debug logging
        console.log('Validating form with data:', {
            name: formData.name,
            country_id: formData.country_id,
            service_type_ids: formData.service_type_ids,
            price_range: formData.price_range,
            lat: formData.lat,
            lng: formData.lng,
            formDataKeys: Object.keys(formData),
            providerExists: !!provider
        });
        
        // Name - ensure we check the actual value
        const nameValue = (formData.name || '').toString().trim();
        if (!nameValue) {
            newErrors.name = 'The name field is required.';
        } else if (nameValue.length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        } else if (nameValue.length > 100) {
            newErrors.name = 'Name must be less than 100 characters';
        } else if (!/^[A-Za-z\s]+$/.test(nameValue)) {
            newErrors.name = 'Name can only contain letters and spaces';
        }
        
        // Service Type - check if it's an array and has items
        const serviceTypeIds = formData.service_type_ids || [];
        if (!Array.isArray(serviceTypeIds) || serviceTypeIds.length === 0) {
            newErrors.service_type_ids = 'The service type ids field is required.';
        }
        
        // Country - check if it's a valid number
        const countryId = formData.country_id;
        const isValidCountryId = countryId !== null && 
                                 countryId !== undefined && 
                                 countryId !== '' && 
                                 !isNaN(Number(countryId)) && 
                                 Number(countryId) > 0;
        if (!isValidCountryId) {
            newErrors.country_id = 'The country id field is required.';
        }
        
        // Location
        const lat = (formData.lat || '').toString().trim();
        const lng = (formData.lng || '').toString().trim();
        if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
            newErrors.location = 'Please select a location on the map';
        }
        
        // Price Range
        const priceRange = (formData.price_range || '').toString().trim();
        if (!priceRange || !allowedPriceRanges.includes(priceRange)) {
            newErrors.price_range = 'The price range field is required.';
        }
        // Website (required and must be valid)
        const websiteValue = (formData.website || '').toString().trim();
        if (!websiteValue) {
            newErrors.website = 'Website is required';
        } else if (!validateURL(websiteValue)) {
            newErrors.website = 'Enter a valid website URL (https://...)';
        }
        // Email (required and must be valid)
        const emailValue = (formData.email || '').toString().trim();
        if (!emailValue) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(emailValue)) {
            newErrors.email = 'Enter a valid email (lowercase only)';
        }
        // Phone (required and must be valid)
        const phoneValue = (formData.phone || '').toString().trim();
        if (!phoneValue) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(phoneValue)) {
            newErrors.phone = 'Enter a valid phone number';
        }
        // Description - basic validation only
        const descriptionValue = (formData.description || '').toString().trim();
        // Create a temporary div to strip HTML tags and get plain text length
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = descriptionValue;
        const plainTextLength = (tempDiv.textContent || tempDiv.innerText || '').trim().length;
        
        if (!descriptionValue || plainTextLength === 0) {
            newErrors.description = 'Description is required';
        } else if (plainTextLength < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }
        // Image (required for new, optional for edit)
        if (!provider && !image) {
            newErrors.image = 'Profile image is required';
        } else if (image && !allowedImageTypes.includes(image.type)) {
            newErrors.image = 'Image must be JPG or PNG';
        }
        // Documents (at least one required for new providers, optional for edits if existing documents exist)
        const hasExistingDocuments = existingDocuments && existingDocuments.length > 0;
        const maxDocuments = 7;
        if (!provider && documents.length === 0) {
            newErrors.documents = 'At least one document is required';
        } else if (provider && !hasExistingDocuments && documents.length === 0) {
            // Editing but no existing documents and no new documents selected
            newErrors.documents = 'At least one document is required';
        } else if (documents.length > maxDocuments) {
            newErrors.documents = `Maximum ${maxDocuments} documents allowed`;
        } else if (documents.length > 0 && documents.some(doc => !allowedDocTypes.includes(doc.type))) {
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
            // Validate provider has ID for update
            if (provider && !provider.id) {
                console.error('Provider object exists but has no ID:', provider);
                setErrors({ general: 'Invalid provider data. Please refresh and try again.' });
                setIsSubmitting(false);
                return;
            }
            
            const url = provider ? `/api/service-providers/${provider.id}` : '/api/service-providers';
            
            // Show compression message if files are large
            if (image || documents.length > 0) {
                const totalSize = (image ? image.size : 0) + documents.reduce((sum, doc) => sum + doc.size, 0);
                if (totalSize > 5 * 1024 * 1024) { // > 5MB
                    console.log('Large files detected, compressing...');
                }
            }
            
            console.log('Request URL:', url);
            console.log('Provider object:', provider);
            console.log('Provider ID:', provider?.id);
            
            // Validate formData has required values before building FormData
            console.log('FormData state before submission:', {
                country_id: formData.country_id,
                name: formData.name,
                service_type_ids: formData.service_type_ids,
                price_range: formData.price_range,
                isArray: Array.isArray(formData.service_type_ids),
                arrayLength: Array.isArray(formData.service_type_ids) ? formData.service_type_ids.length : 'not array',
                fullFormData: formData
            });
            
            // Pre-validate required fields before building FormData
            const validationErrors = {};
            
            // Validate country_id
            const countryId = formData.country_id;
            if (!countryId || countryId === '' || isNaN(Number(countryId)) || Number(countryId) <= 0) {
                validationErrors.country_id = 'Country is required';
                console.error('country_id validation failed:', countryId);
            }
            
            // Validate name
            const name = formData.name;
            if (!name || String(name).trim() === '') {
                validationErrors.name = 'Name is required';
                console.error('name validation failed:', name);
            }
            
            // Validate price_range
            const priceRange = formData.price_range;
            if (!priceRange || String(priceRange).trim() === '') {
                validationErrors.price_range = 'Price range is required';
                console.error('price_range validation failed:', priceRange);
            }
            
            // Validate service_type_ids
            if (!Array.isArray(formData.service_type_ids) || formData.service_type_ids.length === 0) {
                validationErrors.service_type_ids = 'At least one service type is required';
                console.error('service_type_ids validation failed:', formData.service_type_ids);
            }
            
            // If there are validation errors, stop submission
            if (Object.keys(validationErrors).length > 0) {
                console.error('Validation errors found, stopping submission:', validationErrors);
                setErrors(prev => ({ ...prev, ...validationErrors }));
                setIsSubmitting(false);
                return;
            }
            
            const form = new FormData();
            
            // Append all form fields, ensuring proper formatting
            // Required fields: country_id, name, service_type_ids, price_range
            
            // Always append required fields first - we've already validated they exist
            form.append('country_id', Number(countryId));
            form.append('name', String(name).trim());
            form.append('price_range', String(priceRange).trim());
            
            // service_type_ids (required) - must be an array
            if (Array.isArray(formData.service_type_ids) && formData.service_type_ids.length > 0) {
                formData.service_type_ids.forEach((typeId) => {
                    // Convert to number, handling both string and number inputs
                    const numId = Number(typeId);
                    // Only append valid positive numbers (IDs should be > 0)
                    if (!isNaN(numId) && numId > 0) {
                        form.append('service_type_ids[]', numId);
                    }
                });
            } else {
                // If array is empty, log warning but don't append (validation will catch this)
                console.warn('service_type_ids is empty or not an array:', formData.service_type_ids);
            }
            
            // Append optional fields
            Object.entries(formData).forEach(([key, value]) => {
                // Skip fields we've already handled
                if (['country_id', 'name', 'price_range', 'service_type_ids', 'is_approved', 'themes', 'lat', 'lng'].includes(key)) {
                    return;
                }
                
                // Handle country_code separately if needed
                if (key === 'country_code' && value) {
                    form.append('country_code', String(value));
                    return;
                }
                
                // Append other optional fields
                if (value !== null && value !== undefined && value !== '') {
                    form.append(key, String(value));
                }
            });
            
            // Handle themes (optional)
            if (Array.isArray(formData.themes) && formData.themes.length > 0) {
                formData.themes.forEach((themeId) => {
                    const numId = typeof themeId === 'string' ? Number(themeId) : Number(themeId);
                    if (!isNaN(numId) && numId > 0) {
                        form.append('themes[]', numId);
                    }
                });
            }
            
            // Handle is_approved
                    if (showApproveCheckbox) {
                form.append('is_approved', formData.is_approved ? 1 : 0);
                    } else {
                        form.append('is_approved', 0);
                    }
            
            // Handle lat/lng (optional)
            if (formData.lat !== null && formData.lat !== undefined && formData.lat !== '') {
                form.append('lat', String(formData.lat));
            }
            if (formData.lng !== null && formData.lng !== undefined && formData.lng !== '') {
                form.append('lng', String(formData.lng));
            }
            
            // Compress and append image if provided
            let compressedImage = null;
            if (image) {
                try {
                    const compressionSettings = getCompressionSettings('service_provider');
                    compressedImage = await compressImage(image, compressionSettings);
                    console.log(`Image compressed: ${(image.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedImage.size / 1024 / 1024).toFixed(2)}MB`);
        } catch (error) {
                    console.error('Error compressing image, using original:', error);
                    compressedImage = image;
                }
            }
            
            // Compress and append documents if provided
            let compressedDocs = [];
            if (documents.length > 0) {
                try {
                    const compressionSettings = getCompressionSettings('document');
                    compressedDocs = await compressImages(documents, compressionSettings);
                    
                    // Verify all documents were processed
                    if (compressedDocs.length !== documents.length) {
                        console.error(`Document count mismatch: expected ${documents.length}, got ${compressedDocs.length}`);
                        setSummaryError('Error processing documents. Please try again.');
                        setErrors({ documents: 'Error processing documents' });
                        setIsSubmitting(false);
                        return;
                    }
                    
                    compressedDocs.forEach((doc, index) => {
                        const originalDoc = documents[index];
                        if (originalDoc) {
                            if (doc.type.startsWith('image/')) {
                                console.log(`Document ${index + 1} (${doc.name}) compressed: ${(originalDoc.size / 1024 / 1024).toFixed(2)}MB -> ${(doc.size / 1024 / 1024).toFixed(2)}MB`);
                            } else {
                                // PDF or other non-image files - not compressed
                                console.log(`Document ${index + 1} (${doc.name}, ${doc.type}): ${(doc.size / 1024 / 1024).toFixed(2)}MB (not compressed)`);
                            }
                        } else {
                            console.warn(`No original document found for index ${index}`);
                        }
                    });
                } catch (error) {
                    console.error('Error compressing documents, using originals:', error);
                    compressedDocs = documents;
                }
            }
            
            // Calculate total size after compression with detailed logging
            const imageSize = compressedImage ? compressedImage.size : 0;
            const docsSize = compressedDocs.reduce((sum, doc) => {
                const docSize = doc.size || 0;
                console.log(`Document ${doc.name}: ${(docSize / 1024 / 1024).toFixed(2)}MB (type: ${doc.type})`);
                return sum + docSize;
            }, 0);
            const totalSize = imageSize + docsSize;
            const totalSizeMB = totalSize / 1024 / 1024;
            const maxSizeMB = 65; // 7 documents × 10MB = 70MB, leave 5MB buffer
            
            console.log(`Size breakdown - Image: ${(imageSize / 1024 / 1024).toFixed(2)}MB, Documents: ${(docsSize / 1024 / 1024).toFixed(2)}MB`);
            console.log(`Total compressed size: ${totalSizeMB.toFixed(2)}MB`);
            
            // If still too large after compression, show error
            if (totalSizeMB > maxSizeMB) {
                setSummaryError(`Files are too large even after compression (${totalSizeMB.toFixed(2)}MB). Maximum allowed: ${maxSizeMB}MB total (7 documents × 10MB each). Please use smaller files or fewer documents.`);
                setErrors({
                    general: `Total file size (${totalSizeMB.toFixed(2)}MB) exceeds the limit. Maximum: 7 documents, 10MB each (65MB total). Please reduce file sizes or remove some documents.`
                });
                setIsSubmitting(false);
                return;
            }
            
            // Validate and append compressed files to form
            if (compressedImage) {
                // Validate image file
                if (!(compressedImage instanceof File) || compressedImage.size === 0) {
                    setSummaryError('Invalid image file. Please select a valid image.');
                    setErrors({ image: 'Invalid image file' });
            setIsSubmitting(false);
                    return;
                }
                form.append('image', compressedImage, compressedImage.name);
            }
            
            // Validate all documents first before appending
            for (let index = 0; index < compressedDocs.length; index++) {
                const doc = compressedDocs[index];
                
                // Validate each document file
                if (!(doc instanceof File)) {
                    console.error(`Invalid document at index ${index}:`, doc);
                    setSummaryError(`Document ${index + 1} is invalid. Please check all files and try again.`);
                    setErrors({ documents: `Document ${index + 1} is invalid` });
                    setIsSubmitting(false);
                    return;
                }
                
                if (doc.size === 0) {
                    console.error(`Empty document at index ${index}:`, doc.name);
                    setSummaryError(`Document ${index + 1} (${doc.name}) is empty. Please check the file and try again.`);
                    setErrors({ documents: `Document ${index + 1} is empty` });
                    setIsSubmitting(false);
                    return;
                }
                
                // Check file type is allowed
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
                if (!allowedTypes.includes(doc.type)) {
                    console.error(`Invalid file type at index ${index}:`, doc.type);
                    setSummaryError(`Document ${index + 1} (${doc.name}) has invalid file type. Only PDF, JPG, and PNG are allowed.`);
                    setErrors({ documents: `Document ${index + 1} has invalid file type` });
                    setIsSubmitting(false);
                    return;
                }
                
                // Check individual file size (max 10MB per file)
                const docSizeMB = doc.size / 1024 / 1024;
                if (docSizeMB > 10) {
                    console.error(`Document ${index + 1} too large:`, docSizeMB.toFixed(2), 'MB');
                    setSummaryError(`Document ${index + 1} (${doc.name}) is too large (${docSizeMB.toFixed(2)}MB). Maximum size per file is 10MB.`);
                    setErrors({ documents: `Document ${index + 1} is too large` });
                    setIsSubmitting(false);
                    return;
                }
                
                console.log(`Appending document ${index}: ${doc.name} (${(doc.size / 1024 / 1024).toFixed(2)}MB, type: ${doc.type})`);
                form.append('documents[]', doc, doc.name);
            }
            
            // Debug: Log FormData contents before sending
            console.log('FormData state before sending:', {
                country_id: formData.country_id,
                name: formData.name,
                service_type_ids: formData.service_type_ids,
                price_range: formData.price_range,
                themes: formData.themes,
                is_approved: formData.is_approved
            });
            
            // Log actual FormData entries (for debugging)
            console.log('FormData entries being sent:');
            const formDataEntries = [];
            for (let pair of form.entries()) {
                console.log(pair[0] + ': ' + pair[1] + ' (type: ' + typeof pair[1] + ')');
                formDataEntries.push({ key: pair[0], value: pair[1] });
            }
            console.log('All FormData entries:', formDataEntries);
            
            // Verify required fields are present
            const hasCountryId = formDataEntries.some(e => e.key === 'country_id');
            const hasName = formDataEntries.some(e => e.key === 'name');
            const hasPriceRange = formDataEntries.some(e => e.key === 'price_range');
            const hasServiceTypeIds = formDataEntries.some(e => e.key === 'service_type_ids[]');
            
            console.log('Required fields check:', {
                hasCountryId,
                hasName,
                hasPriceRange,
                hasServiceTypeIds,
                serviceTypeIdsCount: formDataEntries.filter(e => e.key === 'service_type_ids[]').length
            });
            
            if (!hasCountryId || !hasName || !hasPriceRange || !hasServiceTypeIds) {
                console.error('Missing required fields in FormData!');
                setErrors(prev => ({
            ...prev,
                    general: 'Required fields are missing. Please check the form and try again.'
                }));
                setIsSubmitting(false);
                return;
            }
            
            // Use apiClient for authenticated requests with FormData
            // For updates with FormData, use POST to /update endpoint (more reliable for arrays)
            try {
                let response;
                if (provider) {
                    // Update request - use POST to /update endpoint for FormData
                    const updateUrl = `/api/service-providers/${provider.id}/update`;
                    console.log('Sending POST request to update endpoint:', updateUrl);
                    response = await window.apiClient.post(updateUrl, form);
                    onSuccess();
                } else {
                    // Create request
                    console.log('Sending POST request to:', url);
                    response = await window.apiClient.post(url, form);
                    
                    // Check if this is a public signup (no approve checkbox) - trigger subscription flow
                    if (!showApproveCheckbox && response.data && response.data.id) {
                        setCreatedProviderId(response.data.id);
                        setFlowStep('subscription');
                        setShowSubscriptionFlow(true);
                    } else {
                        // Admin creating provider - no subscription needed
                        onSuccess();
                    }
                }
            } catch (error) {
                // Handle 413 Content Too Large error specifically
                if (error.response?.status === 413) {
                    setSummaryError('File size is too large. Please reduce image/document sizes and try again. The system will automatically compress files, but very large files may still exceed server limits.');
                    setErrors({
                        general: 'Upload size limit exceeded. Please use smaller files or contact administrator to increase server upload limits.'
                    });
                    setIsSubmitting(false);
                    return;
                }
                
                const errorData = error.response?.data || {};
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
                    if (errorData.errors.email && errorData.errors.email[0]?.includes('already registered')) {
                        summary.push('Email is already registered.');
                    }
                    if (errorData.errors.phone && errorData.errors.phone[0]?.includes('already registered')) {
                        summary.push('Phone number is already registered.');
                    }
                    if (errorData.errors.website && errorData.errors.website[0]?.includes('already registered')) {
                        summary.push('Website is already registered.');
                    }
                    setSummaryError(summary.join(' '));
                } else {
                    setSummaryError(errorData.message || 'An error occurred while saving the service provider');
                }
                return;
            }
        } catch (error) {
            console.error('Error saving service provider:', error);
            setErrors({ general: 'An error occurred while saving the service provider' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Image preview state
    const [imagePreview, setImagePreview] = useState(null);

    // Handle image preview
    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(image);
        } else {
            setImagePreview(null);
        }
    }, [image]);

    return (
    <>
    <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-white to-blue-100 bg-opacity-80 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto p-0 w-full max-w-6xl shadow-2xl rounded-2xl bg-white max-h-[95vh] overflow-y-auto border-0">
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
                    {/* Image Picker - Enhanced */}
                    <div className="mb-6 bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-2xl p-6 border border-gray-200 shadow-lg">
                        <label className="block text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Profile Image <span className="text-red-500">*</span>
                            </label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image Preview Section */}
                            <div className="space-y-4">
                                {/* Existing Image Preview */}
                                {existingImage && !image && (
                                    <div className="relative group">
                                        <div className="p-4 bg-white rounded-xl border-2 border-green-200 shadow-md">
                                            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Current Image</p>
                                            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                                                <img 
                                                    src={`/storage/${existingImage}`} 
                                                    alt="Current profile" 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <p className="text-xs text-gray-600 font-medium truncate flex-1" title={existingImage.split('/').pop()}>
                                                    {existingImage.split('/').pop()}
                                                </p>
                                                <a 
                                                    href={`/storage/${existingImage}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="ml-2 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                                                >
                                                    View Full
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* New Image Preview */}
                                {imagePreview && (
                                    <div className="relative group">
                                        <div className="p-4 bg-white rounded-xl border-2 border-emerald-300 shadow-md">
                                            <p className="text-xs font-semibold text-emerald-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                New Image Preview
                                            </p>
                                            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-emerald-200 bg-gray-50">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                    New
                        </div>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-700 font-medium truncate" title={image.name}>
                                                        {image.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {(image.size / 1024 / 1024).toFixed(2)} {t('file_size_mb')}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImage(null);
                                                        setImagePreview(null);
                                                        // Reset file input
                                                        const fileInput = document.querySelector('input[name="image"]');
                                                        if (fileInput) fileInput.value = '';
                                                    }}
                                                    className="ml-2 px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* File Input */}
                                {!imagePreview && (
                                    <div className="relative">
                            <input
                                            type="file"
                                            name="image"
                                            accept="image/jpeg,image/png,image/jpg"
                                onChange={handleInputChange}
                                            className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-green-500 file:to-emerald-600 file:text-white hover:file:from-green-600 hover:file:to-emerald-700 file:cursor-pointer file:transition-all file:shadow-lg file:hover:shadow-xl cursor-pointer"
                            />
                                        <p className="text-xs text-gray-500 mt-2">JPG or PNG, max 5MB</p>
                        </div>
                                )}
                                
                                {errors.image && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm font-medium">{errors.image}</p>
                                    </div>
                            )}
                        </div>
                            {/* Documents Section - Enhanced */}
                            <div className="space-y-4">
                                <label className="block text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Documents (PDF, JPG, PNG) <span className="text-red-500">*</span>
                            </label>
                                
                                {/* Drag and Drop Area - Enhanced */}
                                <div
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                                        errors.documents 
                                            ? 'border-red-400 bg-red-50' 
                                            : 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100'
                                    }`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.classList.add('border-blue-500', 'bg-blue-100');
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-100');
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-100');
                                        const files = Array.from(e.dataTransfer.files).filter(file => {
                                            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
                                            return validTypes.includes(file.type);
                                        });
                                        if (files.length > 0) {
                                            const currentCount = documents.length;
                                            const maxDocuments = 7;
                                            if (currentCount + files.length > maxDocuments) {
                                                setSummaryError(`Maximum ${maxDocuments} documents allowed. You have ${currentCount} document(s) and trying to add ${files.length} more.`);
                                                setErrors({ documents: `Maximum ${maxDocuments} documents allowed` });
                                                return;
                                            }
                                            setDocuments(prev => [...prev, ...files]);
                                            if (errors.documents) {
                                                setErrors(prev => ({ ...prev, documents: '' }));
                                            }
                                        }
                                    }}
                                >
                            <input
                                type="file"
                                        name="documents"
                                        accept="application/pdf,image/jpeg,image/png,image/jpg"
                                multiple
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            const currentCount = documents.length;
                                            const maxDocuments = 7;
                                            if (currentCount + files.length > maxDocuments) {
                                                setSummaryError(`Maximum ${maxDocuments} documents allowed. You have ${currentCount} document(s) and trying to add ${files.length} more.`);
                                                setErrors({ documents: `Maximum ${maxDocuments} documents allowed` });
                                                return;
                                            }
                                            setDocuments(prev => [...prev, ...files]);
                                            if (errors.documents) {
                                                setErrors(prev => ({ ...prev, documents: '' }));
                                            }
                                        }}
                                        className="hidden"
                                        id="documents-input"
                                    />
                                    <label
                                        htmlFor="documents-input"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <p className="text-base font-bold text-gray-800 mb-2">
                                            Click to browse or drag & drop files here
                                        </p>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Select multiple files at once (PDF, JPG, PNG) • Max 7 documents, 10MB per file
                                        </p>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById('documents-input').click();
                                            }}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            Choose Files
                                        </button>
                                    </label>
                                </div>
                                
                                {/* Existing Documents Display */}
                                {existingDocuments.length > 0 && documents.length === 0 && (
                                    <div className="mt-4 p-5 bg-white border-2 border-blue-200 rounded-xl shadow-md">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-sm font-bold text-gray-800">
                                                    Current Documents ({existingDocuments.length})
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                                            {existingDocuments.map((docPath, index) => {
                                                const fileName = typeof docPath === 'string' ? docPath.split('/').pop() : `Document ${index + 1}`;
                                                const isImage = fileName.match(/\.(jpg|jpeg|png)$/i);
                                                return (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                                isImage ? 'bg-green-100' : 'bg-red-100'
                                                            }`}>
                                                                {isImage ? (
                                                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <span 
                                                                className="text-sm text-gray-700 font-medium truncate flex-1"
                                                                title={fileName}
                                                            >
                                                                {fileName}
                                                            </span>
                                                        </div>
                                                        <a
                                                            href={`/storage/${docPath}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-2 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex-shrink-0"
                                                            title="View document"
                                                        >
                                                            View
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3 text-center">Upload new files above to replace these documents</p>
                                    </div>
                                )}
                                
                                {/* New Documents Display - Enhanced */}
                                {documents.length > 0 && (
                                    <div className="mt-4 p-5 bg-white border-2 border-emerald-300 rounded-xl shadow-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-sm font-bold text-emerald-700">
                                                    New Files Selected ({documents.length})
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setDocuments([])}
                                                className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                                            {documents.map((doc, index) => {
                                                const isImage = doc.name.match(/\.(jpg|jpeg|png)$/i);
                                                const isPDF = doc.name.match(/\.pdf$/i);
                                                return (
                                                    <div key={index} className="group relative p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all">
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                                isImage ? 'bg-green-200' : isPDF ? 'bg-red-200' : 'bg-blue-200'
                                                            }`}>
                                                                {isImage ? (
                                                                    <svg className="w-7 h-7 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-7 h-7 text-red-700" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p 
                                                                    className="text-sm font-semibold text-gray-800 truncate mb-1" 
                                                                    title={doc.name}
                                                                >
                                                                    {doc.name}
                                                                </p>
                                                                <p className="text-xs text-gray-600">
                                                                    {(doc.size / 1024).toFixed(1)} {t('file_size_kb')}
                                                                </p>
                                                            </div>
                                                            <button
                                                                type="button"
                                            onClick={() => {
                                                                    setDocuments(prev => prev.filter((_, i) => i !== index));
                                            }}
                                                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                                                title="Remove file"
                                        >
                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                        </button>
                                    </div>
                            </div>
                                                );
                                            })}
                                        </div>
                                        {existingDocuments.length > 0 && (
                                            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                                <p className="text-xs font-semibold text-orange-700 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    These new files will replace the existing documents
                                                </p>
                                            </div>
                            )}
                        </div>
                                )}
                                
                                {errors.documents && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm font-medium">{errors.documents}</p>
                                    </div>
                                )}
                            </div>
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
                                    // Ensure both are numbers for proper comparison
                                    const serviceTypeIds = (formData.service_type_ids || []).map(id => Number(id));
                                    const isChecked = serviceTypeIds.includes(typeId);
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
                                value={formData.country_id !== null && formData.country_id !== undefined ? String(formData.country_id) : ''}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 text-green-900 placeholder:text-green-400 font-medium shadow-sm transition ${
                                    errors.country_id ? 'border-red-400' : 'border-green-200'
                                }`}
                            >
                                <option value="">Select country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={String(country.id)}>
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
                            <div className="flex gap-2">
                                    <select
                                    name="country_code"
                                    value={formData.country_code || ''}
                                    onChange={e => {
                                        setFormData(prev => ({ ...prev, country_code: e.target.value }));
                                        if (errors.country_code) setErrors(prev => ({ ...prev, country_code: '' }));
                                    }}
                                    className={`px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 font-medium shadow-sm transition ${errors.country_code ? 'border-red-400' : 'border-blue-200'}`}
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
                                    value={formData.phone}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setFormData(prev => ({ ...prev, phone: val }));
                                        if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                                    }}
                                    className={`flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder:text-blue-400 font-medium shadow-sm transition ${errors.phone ? 'border-red-400' : 'border-blue-200'}`}
                                    placeholder="Enter phone number (digits only)"
                                    maxLength={15}
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                            )}
                            {errors.country_code && (
                                <p className="text-red-500 text-sm mt-1">{errors.country_code}</p>
                            )}
                                </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-green-700 mb-2">
                                Description
                            </label>
                            <RichTextEditor
                                value={formData.description || ''}
                                onChange={(value) => {
                                    handleInputChange({ target: { name: 'description', value } });
                                }}
                                placeholder="Enter service provider description"
                                error={errors.description}
                                minHeight={150}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>
                        
                        <div className="md:col-span-2 mb-6">
                            <label className="block text-sm font-semibold text-blue-700 mb-2">
                                Location - Drag the pin or click on map to set location <span className="text-red-500">*</span>
                            </label>
                            
                            {/* Location Search Input */}
                            <div className="relative mb-3 location-search-container">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={locationSearchQuery}
                                        onChange={handleLocationSearchChange}
                                        onKeyDown={handleLocationSearchKeyDown}
                                        placeholder="Search for a location (e.g., city, address, landmark)"
                                        className="w-full px-4 py-2 pr-10 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
                                    />
                                    {isGeocoding && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                        </div>
                                    )}
                                    {!isGeocoding && locationSearchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setLocationSearchQuery('');
                                                setLocationSuggestions([]);
                                                setShowLocationSuggestions(false);
                                            }}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                
                                {/* Location Suggestions Dropdown */}
                                {showLocationSuggestions && locationSuggestions.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-blue-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {locationSuggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleLocationSelect(suggestion)}
                                                className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="text-sm font-medium text-gray-900">{suggestion.display_name}</div>
                                                {suggestion.address && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {[
                                                            suggestion.address.city,
                                                            suggestion.address.state,
                                                            suggestion.address.country
                                                        ].filter(Boolean).join(', ')}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="w-full h-64 md:h-96 border-2 border-blue-200 rounded-lg mb-3 overflow-hidden">
                                {typeof window !== 'undefined' && (
                                    <LocationContext.Provider value={{ updateLocationData }}>
                                        <MapContainer 
                                            center={position} 
                                            zoom={13} 
                                            scrollWheelZoom={true}
                                            style={{ height: '100%', width: '100%' }}
                                            className="z-0"
                                            maxBounds={[[-90, -180], [90, 180]]}
                                            maxBoundsViscosity={1.0}
                                            minZoom={2}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                                noWrap={true}
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
        
        {/* Subscription & Payment Flow - Only for public signup */}
        {showSubscriptionFlow && flowStep === 'subscription' && (
            <SubscriptionSelection
                serviceProviderId={createdProviderId}
                onSelect={(subscription) => {
                    setSelectedSubscription(subscription);
                    setFlowStep('payment');
                }}
                onBack={() => {
                    setShowSubscriptionFlow(false);
                    setFlowStep('form');
                }}
            />
        )}
        
        {showSubscriptionFlow && flowStep === 'payment' && (
            <PaymentForm
                serviceProviderId={createdProviderId}
                subscription={selectedSubscription}
                onSuccess={(data) => {
                    setPaymentData(data);
                    setFlowStep('success');
                }}
                onBack={() => {
                    setFlowStep('subscription');
                }}
            />
        )}
        
        {showSubscriptionFlow && flowStep === 'success' && (
            <PaymentSuccess
                paymentData={paymentData}
                onClose={() => {
                    setShowSubscriptionFlow(false);
                    setFlowStep('form');
                    onSuccess();
                }}
            />
        )}
    </>
    );
};

export default ServiceProviderForm;