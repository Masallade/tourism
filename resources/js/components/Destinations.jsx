import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import { extractServiceTypes, extractThemes } from '../utils/serviceHelpers';

const Destinations = () => {
    const { t } = useTranslation();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const response = await window.apiClient.get('/api/destinations');
            setDestinations(response.data);
        } catch (error) {
            console.error('Error fetching destinations:', error);
            setError(t('error'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 flex items-center justify-center">
                <ClipLoader color="#10b981" size={60} speedMultiplier={0.9} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchDestinations}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        {t('retry')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        {t('explore_destinations')}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        {t('explore_destinations_subtitle')}
                    </p>
                </div>

                {/* Destinations List */}
                {destinations.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">{t('no_destinations')}</p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {destinations.map((destination) => (
                            <DestinationSection key={destination.id} destination={destination} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const DestinationSection = ({ destination }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const services = destination.services || [];
    const servicesPerView = 3; // Desktop: 3, Tablet: 2, Mobile: 1 (handled by CSS)

    const nextSlide = () => {
        setCurrentIndex((prev) => {
            const maxIndex = Math.max(0, services.length - servicesPerView);
            return prev >= maxIndex ? 0 : prev + 1;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => {
            const maxIndex = Math.max(0, services.length - servicesPerView);
            return prev <= 0 ? maxIndex : prev - 1;
        });
    };

    if (services.length === 0) {
        return null; // Don't show destination sections with no services
    }

    return (
        <section className="mb-16">
            {/* Title and Subtitle */}
            <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {destination.title}
                </h2>
                {destination.subtitle && (
                    <p className="text-lg text-gray-600">
                        {destination.subtitle}
                    </p>
                )}
            </div>

            {/* Services Slider */}
            <div className="relative">
                {/* Navigation Arrows */}
                {services.length > servicesPerView && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                            aria-label="Previous services"
                        >
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                            aria-label="Next services"
                        >
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Slider Container */}
                <div className="overflow-hidden rounded-xl">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / servicesPerView)}%)`,
                        }}
                    >
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-4"
                            >
                                <ServiceCard service={service} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Indicator */}
                {services.length > servicesPerView && (
                    <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: Math.ceil(services.length / servicesPerView) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    Math.floor(currentIndex) === index
                                        ? 'bg-green-600 w-8'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

const ServiceCard = ({ service }) => {
    const serviceTypes = extractServiceTypes(service);
    const serviceThemes = extractThemes(service);

    return (
        <Link
            to={`/service/${service.id}`}
            className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 block"
        >
            {/* Service Image */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-green-400 to-blue-500">
                {service.image ? (
                    <img
                        src={`/storage/${service.image}`}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )}
                
                {/* Price Badge */}
                {service.price && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                        ${service.price}
                    </div>
                )}
            </div>

            {/* Service Info */}
            <div className="p-5">
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                    {service.name}
                </h3>
                
                {service.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {service.description}
                    </p>
                )}

                {/* Service Types */}
                {serviceTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {serviceTypes.slice(0, 2).map((type) => (
                            <span
                                key={type.id}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium"
                            >
                                {type.name}
                            </span>
                        ))}
                        {serviceTypes.length > 2 && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                +{serviceTypes.length - 2}
                            </span>
                        )}
                    </div>
                )}

                {/* Provider Info */}
                {service.provider && (
                    <div className="flex items-center text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="truncate">{service.provider.name}</span>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default Destinations;

