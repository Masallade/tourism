import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ServiceCard from './ServiceCard';
import { extractServiceTypes, extractThemes } from '../utils/serviceHelpers';


const ThemeDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [theme, setTheme] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchThemeAndServices = async () => {
      setLoading(true);
      try {
        // Check if id is a number (ID) or string (slug)
        const isNumeric = /^\d+$/.test(id);
        const endpoint = isNumeric ? `/api/themes/${id}` : `/api/themes/slug/${id}`;
        
        // Fetch theme details
        const themeRes = await fetch(endpoint);
        if (!themeRes.ok) {
          throw new Error('Failed to fetch theme');
        }
        const themeData = await themeRes.json();
        setTheme(themeData);

        // Fetch services for this theme using the numeric theme ID
        const themeId = themeData.id;
        const servicesRes = await fetch(`/api/theme/${themeId}/services`);
        if (!servicesRes.ok) {
          const errorData = await servicesRes.json().catch(() => ({}));
          const errorMessage = errorData.error || errorData.message || 'Failed to fetch services';
          console.error('Error fetching services:', errorMessage, errorData);
          throw new Error(errorMessage);
        }
        const servicesData = await servicesRes.json();
        setServices(servicesData);

        const serviceTypeIdSet = new Set();
        servicesData.forEach((svc) => {
          extractServiceTypes(svc).forEach((type) => serviceTypeIdSet.add(Number(type.id)));
        });

        if (serviceTypeIdSet.size) {
          const typesRes = await fetch('/api/service-types');
          if (!typesRes.ok) {
            throw new Error('Failed to fetch service types');
          }
          const allTypes = await typesRes.json();
          const filteredTypes = allTypes
            .filter((type) => serviceTypeIdSet.has(Number(type.id)))
            .map((type) => ({ ...type, id: Number(type.id) }));
          setServiceTypes(filteredTypes);
        } else {
          setServiceTypes([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchThemeAndServices();
  }, [id]);

  // Filter services by selected type
  const filteredServices = selectedType === 'all' 
    ? services 
    : services.filter(service => service.service_type_id === parseInt(selectedType));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-green-800 font-medium">{t('loading_theme_details')}</p>
          </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-700 mb-2">{t('error_loading_data')}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/" className="inline-block bg-blue-600 text-white font-medium rounded-lg px-5 py-3 hover:bg-blue-700 transition">
            {t('return_to_home')}
          </Link>
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-yellow-700 mb-2">{t('theme_not_found')}</h2>
          <p className="text-gray-600 mb-4">{t('theme_not_found_description')}</p>
          <Link to="/" className="inline-block bg-blue-600 text-white font-medium rounded-lg px-5 py-3 hover:bg-blue-700 transition">
            {t('return_to_home')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Theme Image */}
      <div 
        className="h-80 bg-cover bg-center relative"
        style={{
          backgroundImage: theme.image_url
            ? `url(${theme.image_url})`
            : theme.image
              ? `url(/storage/${theme.image})`
              : `url(https://source.unsplash.com/1200x600/?${theme.name},travel)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
            <div className="mb-4">
              <Link to="/" className="text-white opacity-80 hover:opacity-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                {t('back_to_home_link')}
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-white">{theme.name}</h1>
            <p className="text-white/80 mt-2 max-w-2xl">{theme.description || `Explore ${theme.name} travel experiences`}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Service Type Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('available_experiences', { theme: theme.name })}</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedType === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedType('all')}
            >
              {t('all_experiences')}
            </button>
            {serviceTypes.map(type => (
              <button 
                key={type.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedType === type.id.toString() 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedType(type.id.toString())}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">{t('no_services_available')}</h3>
            <p className="text-yellow-700">
              {selectedType === 'all' 
                ? t('no_theme_experiences', { theme: theme.name })
                : t('no_type_services', { 
                    type: serviceTypes.find(st => st.id === parseInt(selectedType))?.name || '', 
                    theme: theme.name 
                  })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeDetail;