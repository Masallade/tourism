import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

const FeaturedHighlights = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const t = setTimeout(() => setSuccessMessage(''), 4000);
            return () => clearTimeout(t);
        }
    }, [successMessage]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await window.apiClient.get('/api/services/all');
            setServices(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load services.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (service, field) => {
        const newValue = !service[field];
        const payload = {
            is_top_destination: field === 'is_top_destination' ? newValue : !!service.is_top_destination,
            is_popular_stay: field === 'is_popular_stay' ? newValue : !!service.is_popular_stay,
            is_top_experience: field === 'is_top_experience' ? newValue : !!service.is_top_experience,
        };
        setUpdatingId(service.id);
        try {
            await window.apiClient.patch(`/api/services/${service.id}/highlights`, payload);
            setServices((prev) =>
                prev.map((s) => (s.id === service.id ? { ...s, ...payload } : s))
            );
            setSuccessMessage('Highlights updated.');
        } catch (err) {
            setError('Failed to update highlights.');
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <ClipLoader color="#10b981" size={48} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Featured Highlights</h1>
            <p className="text-gray-600 mb-6">
                Choose which services appear in <strong>Top Destinations</strong>, <strong>Popular Stays</strong>, and <strong>Top Experiences</strong> on the home page.
            </p>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {successMessage}
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Service
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-green-700 uppercase tracking-wider">
                                    Top Destination
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-blue-700 uppercase tracking-wider">
                                    Popular Stay
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-amber-700 uppercase tracking-wider">
                                    Top Experience
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {services.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        No services found. Add services first.
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => (
                                    <tr key={service.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900">{service.name}</div>
                                            {service.country?.name && (
                                                <div className="text-sm text-gray-500">{service.country.name}</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={!!service.is_top_destination}
                                                onChange={() => handleToggle(service, 'is_top_destination')}
                                                disabled={updatingId === service.id}
                                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={!!service.is_popular_stay}
                                                onChange={() => handleToggle(service, 'is_popular_stay')}
                                                disabled={updatingId === service.id}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={!!service.is_top_experience}
                                                onChange={() => handleToggle(service, 'is_top_experience')}
                                                disabled={updatingId === service.id}
                                                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
                Up to 6 services per category are shown on the home page. Order follows most recently updated.
            </p>
        </div>
    );
};

export default FeaturedHighlights;
