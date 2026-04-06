import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

const ServicesList = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [countryFilter, setCountryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [themeFilter, setThemeFilter] = useState('all');
    const [countries, setCountries] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [themes, setThemes] = useState([]);

    useEffect(() => {
        fetchServices();
        fetchCountries();
        fetchServiceTypes();
        fetchThemes();
    }, []);

    // Filter services when search/filter terms change
    useEffect(() => {
        filterServices();
    }, [services, searchTerm, countryFilter, typeFilter, themeFilter]);

    // Auto-dismiss error message after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const fetchServices = async () => {
        try {
            const response = await window.apiClient.get('/api/services/all');
            setServices(response.data);
            setError(null);
        } catch (error) {
            setError('Error fetching services. Please try again later.');
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await window.apiClient.get('/api/countries');
            setCountries(response.data);
        } catch (error) {
            console.error('Error fetching countries:', error);
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

    const fetchThemes = async () => {
        try {
            const response = await window.apiClient.get('/api/themes');
            setThemes(response.data);
        } catch (error) {
            console.error('Error fetching themes:', error);
        }
    };

    const filterServices = () => {
        let filtered = [...services];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Country filter
        if (countryFilter !== 'all') {
            filtered = filtered.filter(service => {
                const countryId = service.country_id || service.country?.id;
                return Number(countryId) === Number(countryFilter);
            });
        }

        // Service type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(service => {
                const serviceTypes = service.service_types || service.serviceTypes || [];
                return serviceTypes.some(type => Number(type.id) === Number(typeFilter));
            });
        }

        // Theme filter
        if (themeFilter !== 'all') {
            filtered = filtered.filter(service => {
                const themes = service.themes || [];
                return themes.some(theme => Number(theme.id) === Number(themeFilter));
            });
        }

        setFilteredServices(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCountryFilter('all');
        setTypeFilter('all');
        setThemeFilter('all');
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/40">
                <ClipLoader color="#10b981" size={60} speedMultiplier={0.9} />
            </div>
        );
    }

    return (
        <div className="p-6">
            {loading && <div>Loading services...</div>}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}
            {!loading && !error && (
                <>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by name, description, provider..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Country Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                <select
                                    value={countryFilter}
                                    onChange={(e) => setCountryFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="all">All Countries</option>
                                    {countries.map(country => (
                                        <option key={country.id} value={country.id}>{country.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Service Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="all">All Types</option>
                                    {serviceTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Theme Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                                <select
                                    value={themeFilter}
                                    onChange={(e) => setThemeFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="all">All Themes</option>
                                    {themes.map(theme => (
                                        <option key={theme.id} value={theme.id}>{theme.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Showing {filteredServices.length} of {services.length} services
                            </div>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                    </svg>
                                    <span className="text-red-700 font-medium">{error}</span>
                                </div>
                                <button
                                    onClick={() => setError(null)}
                                    className="text-red-500 hover:text-red-700 focus:outline-none"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Themes</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredServices.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                No services found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredServices.map((service) => (
                                            <tr key={service.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {service.image ? (
                                                            <img
                                                                src={`/storage/${service.image}`}
                                                                alt={service.name}
                                                                className="w-10 h-10 rounded-lg object-cover mr-3"
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-blue-600 bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                                                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                                                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                                            <div className="text-sm text-gray-500 max-w-xs truncate">{service.description}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{service.provider?.name || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-wrap gap-1">
                                                        {(service.service_types || service.serviceTypes || []).slice(0, 2).map((type) => (
                                                            <span
                                                                key={type.id}
                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                            >
                                                                {type.name}
                                                            </span>
                                                        ))}
                                                        {(service.service_types || service.serviceTypes || []).length > 2 && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                                +{(service.service_types || service.serviceTypes || []).length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{service.country?.name || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-wrap gap-1">
                                                        {(service.themes || []).slice(0, 2).map((theme) => (
                                                            <span
                                                                key={theme.id}
                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                                            >
                                                                {theme.name}
                                                            </span>
                                                        ))}
                                                        {(service.themes || []).length > 2 && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                                +{(service.themes || []).length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {service.price ? `$${service.price}` : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        to={`/service/${service.id}`}
                                                        className="text-green-600 hover:text-green-900 mr-4"
                                                        target="_blank"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ServicesList;




