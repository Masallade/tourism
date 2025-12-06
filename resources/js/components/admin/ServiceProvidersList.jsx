import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import ServiceProviderForm from './ServiceProviderForm';

const ServiceProvidersList = () => {
    const [serviceProviders, setServiceProviders] = useState([]);
    const [filteredProviders, setFilteredProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProvider, setEditingProvider] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [approvalAction, setApprovalAction] = useState(null); // 'approve' or 'reject'
    const [processingProvider, setProcessingProvider] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'approved', 'pending'
    const [countryFilter, setCountryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [countries, setCountries] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [selectedProviderDocuments, setSelectedProviderDocuments] = useState([]);

    useEffect(() => {
        fetchServiceProviders();
        fetchCountries();
        fetchServiceTypes();
    }, []);

    // Filter providers when search/filter terms change
    useEffect(() => {
        filterProviders();
    }, [serviceProviders, searchTerm, statusFilter, countryFilter, typeFilter]);

    // Auto-dismiss success message after 5 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Auto-dismiss error message after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const fetchServiceProviders = async () => {
        try {
            const response = await window.apiClient.get('/api/service-providers');
            setServiceProviders(response.data);
            setError(null);
        } catch (error) {
            setError('Error fetching service providers. Please try again later.');
            console.error('Error fetching service providers:', error);
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

    const filterProviders = () => {
        let filtered = [...serviceProviders];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(provider =>
                provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.phone?.includes(searchTerm) ||
                provider.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(provider => {
                if (statusFilter === 'approved') return provider.is_approved;
                if (statusFilter === 'pending') return !provider.is_approved;
                return true;
            });
        }

        // Country filter
        if (countryFilter !== 'all') {
            filtered = filtered.filter(provider => provider.country?.id == countryFilter);
        }

        // Service type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(provider => {
                const providerTypes = provider.service_types || provider.serviceTypes || [];
                return providerTypes.some(type => type.id == typeFilter);
            });
        }

        setFilteredProviders(filtered);
    };

    const handleViewDocuments = (provider) => {
        console.log('Provider documents:', provider.documents);
        setSelectedProviderDocuments(provider.documents || []);
        setShowDocumentsModal(true);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setCountryFilter('all');
        setTypeFilter('all');
    };

    const downloadDocument = async (docPath) => {
        try {
            // Extract filename from the full path
            const filename = docPath.split('/').pop();
            
            // Use the API endpoint for downloads
            const downloadUrl = `/api/documents/${filename}`;
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            link.target = '_blank';
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading document:', error);
            setError('Failed to download document. Please try again.');
        }
    };

    const viewDocument = (docPath) => {
        try {
            console.log('Document path:', docPath);
            
            // Extract filename from the full path
            const filename = docPath.split('/').pop();
            console.log('Extracted filename:', filename);
            
            // Use the API endpoint for viewing
            const viewUrl = `/api/documents/view/${filename}`;
            console.log('View URL:', viewUrl);
            
            // Open in new tab
            window.open(viewUrl, '_blank');
        } catch (error) {
            console.error('Error viewing document:', error);
            setError('Failed to view document. Please try again.');
        }
    };

    const handleDelete = async (provider) => {
        if (!confirm('Are you sure you want to delete this service provider?')) {
            return;
        }

        try {
            await window.apiClient.delete(`/api/service-providers/${provider.id}`);
            setSuccessMessage('Service Provider deleted successfully');
            fetchServiceProviders();
        } catch (error) {
            console.error('Error deleting service provider:', error);
        }
    };

    const handleToggleApproval = (provider) => {
        setProcessingProvider(provider);
        setApprovalAction(provider.is_approved ? 'reject' : 'approve');
        setShowApprovalModal(true);
    };

    const confirmApprovalAction = async () => {
        if (!processingProvider) return;
        
        setIsProcessing(true);
        try {
            const endpoint = approvalAction === 'approve'
                ? `/api/service-providers/${processingProvider.id}/approve`
                : `/api/service-providers/${processingProvider.id}/reject`;
            
            await window.apiClient.patch(endpoint);
            setSuccessMessage(
                approvalAction === 'approve' 
                    ? 'Service Provider approved successfully and email sent!' 
                    : 'Service Provider rejected and email sent.'
            );
            await fetchServiceProviders();
            
            // Close modal after a short delay to show success
            setTimeout(() => {
                setShowApprovalModal(false);
                setProcessingProvider(null);
                setApprovalAction(null);
                setIsProcessing(false);
            }, 1000);
        } catch (error) {
            console.error('Error updating approval status:', error);
            setError('An error occurred. Please try again.');
            setIsProcessing(false);
        }
    };

    const cancelApprovalAction = () => {
        setShowApprovalModal(false);
        setProcessingProvider(null);
        setApprovalAction(null);
        setIsProcessing(false);
    };

    const handleEdit = (provider) => {
        setEditingProvider(provider);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingProvider(null);
    };

    const handleFormSuccess = () => {
        setSuccessMessage(editingProvider ? 'Service Provider updated successfully' : 'Service Provider created successfully');
        setShowForm(false);
        setEditingProvider(null);
        fetchServiceProviders();
    };

    const getTypeBadgeColor = (type) => {
        switch (type) {
            case 'accommodation': return 'bg-blue-100 text-blue-800';
            case 'restaurant': return 'bg-green-100 text-green-800';
            case 'tour_operator': return 'bg-purple-100 text-purple-800';
            case 'activity': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
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
            {loading && <div>Loading service providers...</div>}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}
            {!loading && !error && (
                <>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Service Providers Management</h1>
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
                                        placeholder="Search by name, email, phone, website..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                </select>
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
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Showing {filteredProviders.length} of {serviceProviders.length} providers
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

                    {successMessage && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                    <span className="text-green-700 font-medium">{successMessage}</span>
                                </div>
                                <button
                                    onClick={() => setSuccessMessage('')}
                                    className="text-green-500 hover:text-green-700 focus:outline-none"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Themes</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProviders.map((provider) => (
                                        <tr key={provider.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-green-600 bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                                                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                                                        <div className="text-sm text-gray-500 max-w-xs truncate">{provider.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {(provider.service_types || provider.serviceTypes) && (provider.service_types || provider.serviceTypes).length > 0 ? (
                                                        (provider.service_types || provider.serviceTypes).map((stype) => (
                                                            <span key={stype.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                                                {stype.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">N/A</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{provider.country?.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {provider.themes?.map((theme) => (
                                                        <span key={theme.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            {theme.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    provider.is_approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {provider.is_approved ? (
                                                        <>
                                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                            </svg>
                                                            Approved
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                                            </svg>
                                                            Pending
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {provider.documents && provider.documents.length > 0 ? (
                                                        <button
                                                            onClick={() => handleViewDocuments(provider)}
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            {provider.documents.length} file{provider.documents.length !== 1 ? 's' : ''}
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No documents</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="space-y-1">
                                                    {provider.email && (
                                                        <div>{provider.email}</div>
                                                    )}
                                                    {provider.phone && (
                                                        <div>
                                                          {provider.country_code ? `${provider.country_code} ` : ''}
                                                          {provider.phone}
                                                        </div>
                                                    )}
                                                    {provider.website && (
                                                        <div className="truncate max-w-xs">
                                                            <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                                                {provider.website}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(provider)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleApproval(provider)}
                                                        className={`${provider.is_approved ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                                        title={provider.is_approved ? 'Unapprove' : 'Approve'}
                                                    >
                                                        {provider.is_approved ? (
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                            </svg>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(provider)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {showForm && (
                        <ServiceProviderForm
                            provider={editingProvider}
                            onClose={handleFormClose}
                            onSuccess={handleFormSuccess}
                            showApproveCheckbox={true}
                        />
                    )}

                    {/* Approval/Rejection Modal */}
                    {showApprovalModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                                <div className="text-center">
                                    {/* Icon */}
                                    <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
                                        approvalAction === 'approve' ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                        {approvalAction === 'approve' ? (
                                            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {approvalAction === 'approve' ? 'Approve Service Provider?' : 'Reject Service Provider?'}
                                    </h3>

                                    {/* Message */}
                                    <p className="text-gray-600 mb-6">
                                        {approvalAction === 'approve' 
                                            ? `Are you sure you want to approve "${processingProvider?.name}"? An email with login credentials will be sent to their email address.`
                                            : `Are you sure you want to reject "${processingProvider?.name}"? A rejection notification will be sent to their email address.`
                                        }
                                    </p>

                                    {/* Processing State */}
                                    {isProcessing && (
                                        <div className="mb-4 flex items-center justify-center">
                                            <ClipLoader color={approvalAction === 'approve' ? '#10b981' : '#ef4444'} size={40} />
                                            <span className="ml-3 text-gray-700 font-medium">Processing...</span>
                                        </div>
                                    )}

                                    {/* Buttons */}
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={cancelApprovalAction}
                                            disabled={isProcessing}
                                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmApprovalAction}
                                            disabled={isProcessing}
                                            className={`flex-1 px-4 py-3 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition ${
                                                approvalAction === 'approve'
                                                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                            }`}
                                        >
                                            {isProcessing 
                                                ? 'Processing...' 
                                                : approvalAction === 'approve' ? 'Yes, Approve' : 'Yes, Reject'
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents Modal */}
                    {showDocumentsModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900">Service Provider Documents</h3>
                                    <button
                                        onClick={() => setShowDocumentsModal(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="p-6 overflow-y-auto max-h-[60vh]">
                                    {selectedProviderDocuments.length > 0 ? (
                                        <div className="space-y-4">
                                            {selectedProviderDocuments.map((doc, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            {doc.toLowerCase().includes('.pdf') ? (
                                                                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {doc.split('/').pop()}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {doc.toLowerCase().includes('.pdf') ? 'PDF Document' : 'Image File'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => viewDocument(doc)}
                                                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => downloadDocument(doc)}
                                                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Download
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                                            <p className="mt-1 text-sm text-gray-500">This service provider has not uploaded any documents.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ServiceProvidersList;