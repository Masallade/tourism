import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ServiceCard from './ServiceCard';
import StaticMap from './StaticMap';

const ServiceProviderDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch provider details
        const providerRes = await window.apiClient.get(`/api/service-providers/${id}`);
        const providerData = providerRes?.data;
        
        if (!providerData || !providerData.id) {
          throw new Error('Invalid provider data returned from server');
        }
        
        setProvider(providerData);

        // Fetch services for this provider
        try {
          const servicesRes = await window.apiClient.get(`/api/provider/services?provider_id=${id}`);
          const servicesData = servicesRes?.data;
          if (Array.isArray(servicesData)) {
            setServices(servicesData);
          } else {
            setServices([]);
          }
        } catch (servicesErr) {
          console.warn('Error fetching services:', servicesErr);
          setServices([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching provider data:', err);
        if (err.response?.status === 404) {
          setError('Service provider not found');
        } else {
          setError(err.message || 'Failed to load provider details');
        }
        setLoading(false);
      }
    };

    if (id) {
      fetchProviderDetails();
    } else {
      setError('Invalid provider ID');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-800 font-medium">{t('loading')}...</p>
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
          <h2 className="text-2xl font-bold text-red-700 mb-2">{t('error')}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/" className="inline-block bg-blue-600 text-white font-medium rounded-lg px-5 py-3 hover:bg-blue-700 transition">
            {t('back_to_home')}
          </Link>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-yellow-700 mb-2">{t('provider_not_found')}</h2>
          <p className="text-gray-600 mb-4">{t('provider_not_found_message')}</p>
          <Link to="/" className="inline-block bg-blue-600 text-white font-medium rounded-lg px-5 py-3 hover:bg-blue-700 transition">
            {t('back_to_home')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Provider Image */}
      <div 
        className="h-80 bg-cover bg-center relative"
        style={{
          backgroundImage: provider.image
            ? `url(/storage/${provider.image})`
            : `url(https://source.unsplash.com/1200x600/?travel,business)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
            <div className="mb-4">
              <Link to="/" className="text-white opacity-80 hover:opacity-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                {t('back_to_home')}
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-white">{provider.name}</h1>
            {provider.country && (
              <p className="text-white/80 mt-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {provider.country.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            {provider.description && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('about_provider')}</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{provider.description}</p>
              </div>
            )}

            {/* Service Types */}
            {(provider.service_types || provider.serviceTypes) && (provider.service_types || provider.serviceTypes).length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('service_types')}</h2>
                <div className="flex flex-wrap gap-2">
                  {(provider.service_types || provider.serviceTypes).map((type) => (
                    <span
                      key={type.id}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Themes */}
            {provider.themes && provider.themes.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('themes')}</h2>
                <div className="flex flex-wrap gap-2">
                  {provider.themes.map((theme) => (
                    <span
                      key={theme.id}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {theme.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services Offered */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('services_offered')}</h2>
              {services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-yellow-800 mb-2">{t('no_services_available')}</h3>
                  <p className="text-yellow-700">{t('no_services_message')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Quick Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t('quick_info')}</h3>
              
              {/* Price Range */}
              {provider.price_range && (
                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm font-medium text-gray-600 mb-1">{t('price_range')}</p>
                  <p className="text-lg font-bold text-green-600">{provider.price_range}</p>
                </div>
              )}

              {/* Country */}
              {provider.country && (
                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm font-medium text-gray-600 mb-1">{t('location')}</p>
                  <p className="text-gray-800">{provider.country.name}</p>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-3">
                {provider.email && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('email')}</p>
                      <a href={`mailto:${provider.email}`} className="text-green-600 hover:underline">
                        {provider.email}
                      </a>
                    </div>
                  </div>
                )}

                {provider.phone && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('phone')}</p>
                      <p className="text-gray-800">
                        {provider.country_code ? `${provider.country_code} ` : ''}
                        {provider.phone}
                      </p>
                    </div>
                  </div>
                )}

                {provider.website && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('website')}</p>
                      <a 
                        href={provider.website.startsWith('http://') || provider.website.startsWith('https://') 
                          ? provider.website 
                          : `https://${provider.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline break-all"
                      >
                        {provider.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Map */}
              {provider.lat && provider.lng && !isNaN(parseFloat(provider.lat)) && !isNaN(parseFloat(provider.lng)) && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{t('location_on_map')}</h4>
                  <div className="rounded-lg overflow-hidden">
                    <StaticMap 
                      lat={parseFloat(provider.lat)} 
                      lng={parseFloat(provider.lng)}
                      zoom={12}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDetail;
