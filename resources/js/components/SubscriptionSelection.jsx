import React, { useState, useEffect } from 'react';

const SubscriptionSelection = ({ serviceProviderId, onSelect, onBack }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await window.apiClient.get('/api/subscriptions');
            setSubscriptions(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching subscriptions:', err);
            setError('Failed to load subscriptions');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (subscription) => {
        setSelectedSubscription(subscription);
    };

    const handleContinue = () => {
        if (selectedSubscription) {
            onSelect(selectedSubscription);
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getPeriodLabel = (period) => {
        const labels = {
            'daily': 'per day',
            'weekly': 'per week',
            'monthly': 'per month',
            'yearly': 'per year',
            'lifetime': 'one-time'
        };
        return labels[period.toLowerCase()] || period;
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading subscriptions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 w-full max-w-4xl">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Choose Your Subscription Plan</h2>
                        <p className="mt-2 text-gray-600">Select a plan to continue with your registration</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Subscriptions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {subscriptions.map((subscription) => (
                            <div
                                key={subscription.id}
                                onClick={() => handleSelect(subscription)}
                                className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                                    selectedSubscription?.id === subscription.id
                                        ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                                }`}
                            >
                                {/* Selected Badge */}
                                {selectedSubscription?.id === subscription.id && (
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-blue-500 text-white rounded-full p-1">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Plan Name */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{subscription.heading}</h3>

                                {/* Price */}
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-blue-600">
                                        {formatAmount(subscription.amount)}
                                    </span>
                                    <span className="text-gray-600 ml-2">
                                        {getPeriodLabel(subscription.period)}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {subscription.description}
                                </p>

                                {/* Select Button */}
                                <button
                                    type="button"
                                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                                        selectedSubscription?.id === subscription.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {selectedSubscription?.id === subscription.id ? 'Selected' : 'Select Plan'}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* No Subscriptions Message */}
                    {subscriptions.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No subscriptions available</h3>
                            <p className="mt-1 text-sm text-gray-500">Please contact support for assistance.</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-6 border-t">
                        <button
                            type="button"
                            onClick={onBack}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            ← Back to Form
                        </button>
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={!selectedSubscription}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue to Payment →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSelection;




