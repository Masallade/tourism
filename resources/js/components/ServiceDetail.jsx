import React, { useState, useEffect } from 'react';
import StaticMap from './StaticMap';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { extractServiceTypes, extractThemes } from '../utils/serviceHelpers';
import { countryCodes } from '../utils/countryCodes';
import { sanitizeDescriptionHtml } from '../utils/sanitizeHtml';

const ServiceDetail = () => {
  const { t, i18n } = useTranslation();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Images for carousel
  const [images, setImages] = useState([]);
  // Modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  // Stepper state
  const [bookingStep, setBookingStep] = useState(0); // 0: Contact, 1: Location, 2: Payment
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    country_code: '',
    email: '',
    location: '',
    card: '',
    expiry: '',
    cvv: '',
  });
  // Animation state
  const [stepAnim, setStepAnim] = useState('');
  
  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      try {
        // Use apiClient so Accept-Language and locale are sent → backend returns translated content
        const response = await window.apiClient.get(`/api/services/${serviceId}`);
        const data = response.data;
        setService(data);
        
        // Prepare images array for carousel
        const serviceImages = [];
        if (data.image) serviceImages.push(`/storage/${data.image}`);
        if (data.image_2) serviceImages.push(`/storage/${data.image_2}`);
        if (data.image_3) serviceImages.push(`/storage/${data.image_3}`);
        
        setImages(serviceImages);
        setLoading(false);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Service not found' : (err.message || 'Service not found'));
        setLoading(false);
      }
    };
    
    fetchServiceDetails();
  }, [serviceId, i18n.language]);
  
  // Move to the next image in the carousel
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  // Move to the previous image in the carousel
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  // For thumbnail click
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error: {error}</p>
              </div>
            </div>
          </div>
          <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                &larr; {t('back_to_home')}
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <style>{`
        .rich-text-content {
          font-family: 'Inter', sans-serif;
          line-height: 1.7;
        }
        .rich-text-content p {
          margin-bottom: 1rem;
          color: #374151;
        }
        .rich-text-content h1,
        .rich-text-content h2,
        .rich-text-content h3,
        .rich-text-content h4,
        .rich-text-content h5,
        .rich-text-content h6 {
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #111827;
          font-family: 'Poppins', sans-serif;
        }
        .rich-text-content h1 { font-size: 2rem; }
        .rich-text-content h2 { font-size: 1.75rem; }
        .rich-text-content h3 { font-size: 1.5rem; }
        .rich-text-content h4 { font-size: 1.25rem; }
        .rich-text-content ul,
        .rich-text-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        .rich-text-content ul {
          list-style-type: disc;
        }
        .rich-text-content ol {
          list-style-type: decimal;
        }
        .rich-text-content li {
          margin: 0.5rem 0;
        }
        .rich-text-content a {
          color: #10b981;
          text-decoration: underline;
        }
        .rich-text-content a:hover {
          color: #059669;
        }
        .rich-text-content strong {
          font-weight: 700;
        }
        .rich-text-content em {
          font-style: italic;
        }
        .rich-text-content u {
          text-decoration: underline;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
          {(() => {
            // Check where we came from
            const fromProviderId = location.state?.fromProviderId;
            const fromTrips = location.state?.fromTrips;
            
            if (fromProviderId) {
              // Go back to service provider detail page
              return (
                <button
                  onClick={() => navigate(`/service-provider/${fromProviderId}`)}
                  className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('back')}
                </button>
              );
            }
            
            if (fromTrips) {
              // Go back to trips page
              return (
                <button
                  onClick={() => navigate('/trips')}
                  className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('back')}
                </button>
              );
            }
            
            // Default: go back to home page
            return (
              <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('back')}
              </Link>
            );
          })()}
        </div>
        
        {/* Service Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{service.name}</h1>
        
        {/* Image Carousel */}
        {images.length > 0 && (
          <div className="relative mb-8 rounded-lg overflow-hidden shadow-md">
            {/* Main Image */}
            <div className="w-full h-96 relative">
              <img 
                src={images[currentImageIndex]} 
                alt={`${service.name} - Image ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-2 p-2">
                {images.map((img, index) => (
                  <div 
                    key={index}
                    className={`w-20 h-20 cursor-pointer border-2 ${currentImageIndex === index ? 'border-green-500' : 'border-transparent'}`}
                    onClick={() => goToImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Service info tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="border-b">
                <nav className="flex -mb-px">
                  <button className="text-green-600 border-green-600 py-4 px-6 border-b-2 font-medium text-sm">
                    {t('about_service')}
                  </button>
                </nav>
              </div>
              
              {/* Overview Section */}
              {service.overview && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">{t('overview')}</h2>
                  <div 
                    className="text-gray-700 rich-text-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeDescriptionHtml(service.overview) }}
                  />
                </div>
              )}
              
              {/* Description Section */}
              {service.description && (
                <div className="p-6 border-t">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">{t('description')}</h2>
                  <div 
                    className="text-gray-700 rich-text-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeDescriptionHtml(service.description) }}
                  />
                </div>
              )}
              
              {/* Details Section */}
              {service.details && (
                <div className="p-6 border-t">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">{t('details')}</h2>
                  <div 
                    className="text-gray-700 rich-text-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeDescriptionHtml(service.details) }}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Booking & Info */}
          <div>
            {/* Quick Info Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('service_information')}</h3>
                
                <div className="space-y-4">
                  {/* Price */}
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">{t('price')}</p>
                      <p className="text-gray-700">${service.price}</p>
                    </div>
                  </div>
                  
                  {/* Age Range */}
                  {(service.min_age || service.max_age) && (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">{t('ages')}</p>
                        <p className="text-gray-700">
                          {service.min_age && service.max_age 
                            ? `${service.min_age}-${service.max_age}`
                            : service.min_age 
                              ? `${service.min_age}+` 
                              : `Up to ${service.max_age}`}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Duration */}
                  {service.duration && (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">{t('duration')}</p>
                        <p className="text-gray-700">{service.duration}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Provider - clickable link to provider page */}
                  {service.provider && (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">{t('service_provider')}</p>
                        <Link
                          to={`/service-provider/${service.provider.id}`}
                          className="text-green-600 hover:text-green-800 hover:underline font-medium transition-colors inline-flex items-center gap-1"
                        >
                          {service.provider.name}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {/* Country */}
                  {service.country && (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">{t('country')}</p>
                        <p className="text-gray-700">{service.country.name}</p>
                      </div>
                    </div>
                  )}

                  {/* Service Types */}
                  {extractServiceTypes(service).length > 0 && (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">{extractServiceTypes(service).length > 1 ? t('service_types') : t('service_type')}</p>
                        <div className="flex flex-wrap gap-1">
                          {extractServiceTypes(service).map((type) => (
                            <span key={type.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {type.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Themes */}
                  {extractThemes(service).length > 0 && (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-purple-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">{extractThemes(service).length > 1 ? t('themes') : t('theme')}</p>
                        <div className="flex flex-wrap gap-1">
                          {extractThemes(service).map((theme) => (
                            <span key={theme.id} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                              {theme.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lat/Lng and Map */}
                  {(service.lat || service.lng) && (
                    <>
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">{t('location')} (Lat/Lng)</p>
                          <p className="text-gray-700">
                            {service.lat && (
                              <span>Lat: {parseFloat(service.lat).toFixed(6)}</span>
                            )}
                            {service.lng && (
                              <span> | Lng: {parseFloat(service.lng).toFixed(6)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <StaticMap lat={service.lat} lng={service.lng} height={180} zoom={13} />
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Book Now Button - COMMENTED OUT */}
            {/* <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <button
                  className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-md font-medium hover:from-green-600 hover:to-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                  onClick={() => navigate(`/booking/${serviceId}`)}
                >
                  {t('book_now')}
                </button>
              </div>
            </div> */}
            {/* Booking Modal - Multi-step/Stepper UI */}
            {showBookingModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-modalPop">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
                    onClick={() => { setShowBookingModal(false); setBookingStep(0); setStepAnim(''); }}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 tracking-tight">Book This Service</h2>
                  {/* Progress Stepper - pill/circular modern look */}
                  <div className="flex items-center justify-center mb-8">
                    {[t('contact_details'), t('location'), t('payment_details')].map((label, idx) => (
                      <React.Fragment key={label}>
                        <div className={`flex flex-col items-center transition-all duration-300 ${idx === bookingStep ? 'text-green-600 scale-110' : 'text-gray-400'}`}>
                          <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold text-lg shadow-sm transition-all duration-300 ${idx === bookingStep ? 'border-green-600 bg-gradient-to-br from-green-100 to-blue-100' : 'border-gray-300 bg-white'}`}>{idx+1}</div>
                          <span className="text-xs mt-1 font-medium tracking-wide">{label}</span>
                        </div>
                        {idx < 2 && <div className="w-10 h-1 rounded-full bg-gray-200 mx-2 transition-all duration-300" />}
                      </React.Fragment>
                    ))}
                  </div>
                  <form className="space-y-8">
                    {/* Step 1: Contact Details */}
                    <div className={`transition-all duration-500 ${bookingStep === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'} ${stepAnim === 'left' ? 'animate-slideLeft' : stepAnim === 'right' ? 'animate-slideRight' : ''}`}>
                      {bookingStep === 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-gray-700">{t('contact_details')}</h3>
                          <div className="grid grid-cols-1 gap-4">
                            <input type="text" className="border-2 rounded-full px-5 py-3 w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all" placeholder={t('full_name_placeholder')} value={bookingForm.name} onChange={e => setBookingForm(f => ({...f, name: e.target.value}))} />
                            <div className="flex gap-2">
                              <select
                                value={bookingForm.country_code || ''}
                                onChange={e => setBookingForm(f => ({...f, country_code: e.target.value}))}
                                className="px-4 py-3 border-2 rounded-full focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                              >
                                <option value="">{t('code')}</option>
                                {countryCodes.map((cc) => (
                                  <option key={cc.code} value={cc.code}>
                                    {cc.code}
                                  </option>
                                ))}
                              </select>
                              <input type="tel" className="flex-1 border-2 rounded-full px-5 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all" placeholder={t('phone_number')} value={bookingForm.phone} onChange={e => setBookingForm(f => ({...f, phone: e.target.value}))} />
                            </div>
                            <input type="email" className="border-2 rounded-full px-5 py-3 w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all" placeholder={t('email_address')} value={bookingForm.email} onChange={e => setBookingForm(f => ({...f, email: e.target.value}))} />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Step 2: Pick Up Location */}
                    <div className={`transition-all duration-500 ${bookingStep === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'} ${stepAnim === 'left' ? 'animate-slideLeft' : stepAnim === 'right' ? 'animate-slideRight' : ''}`}>
                      {bookingStep === 1 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-gray-700">{t('pick_up_location')}</h3>
                          <input type="text" className="border-2 rounded-full px-5 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" placeholder={t('enter_pickup_location')} value={bookingForm.location} onChange={e => setBookingForm(f => ({...f, location: e.target.value}))} />
                        </div>
                      )}
                    </div>
                    {/* Step 3: Payment Details */}
                    <div className={`transition-all duration-500 ${bookingStep === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'} ${stepAnim === 'left' ? 'animate-slideLeft' : stepAnim === 'right' ? 'animate-slideRight' : ''}`}>
                      {bookingStep === 2 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-gray-700">Payment Details</h3>
                          <input type="text" className="border-2 rounded-full px-5 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" placeholder="Card Number" value={bookingForm.card} onChange={e => setBookingForm(f => ({...f, card: e.target.value}))} />
                          <div className="flex gap-4 mt-2">
                            <input type="text" className="border-2 rounded-full px-5 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" placeholder="MM/YY" value={bookingForm.expiry} onChange={e => setBookingForm(f => ({...f, expiry: e.target.value}))} />
                            <input type="text" className="border-2 rounded-full px-5 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" placeholder="CVV" value={bookingForm.cvv} onChange={e => setBookingForm(f => ({...f, cvv: e.target.value}))} />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Stepper Navigation */}
                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        className={`px-6 py-2 rounded-full bg-gray-200 text-gray-700 font-medium shadow-sm transition-all duration-200 ${bookingStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                        onClick={() => { setStepAnim('right'); setTimeout(() => { setBookingStep((s) => Math.max(0, s - 1)); setStepAnim(''); }, 200); }}
                        disabled={bookingStep === 0}
                      >
                        {t('back')}
                      </button>
                      {bookingStep < 2 ? (
                        <button
                          type="button"
                          className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium shadow-md hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                          onClick={() => { setStepAnim('left'); setTimeout(() => { setBookingStep((s) => Math.min(2, s + 1)); setStepAnim(''); }, 200); }}
                        >
                          {t('next')}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium opacity-60 cursor-not-allowed shadow-md"
                          disabled
                        >
                          {t('confirm_booking', { defaultValue: 'Confirm Booking (Coming Soon)' })}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ServiceDetail;