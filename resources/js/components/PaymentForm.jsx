import React, { useState } from 'react';

const PaymentForm = ({ serviceProviderId, subscription, onSuccess, onBack }) => {
    const [formData, setFormData] = useState({
        card_number: '',
        card_expiry: '',
        card_cvv: '',
        cardholder_name: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.slice(0, 2) + '/' + v.slice(2, 4);
        }
        return v;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'card_number') {
            formattedValue = formatCardNumber(value);
        } else if (name === 'card_expiry') {
            formattedValue = formatExpiry(value);
        } else if (name === 'card_cvv') {
            formattedValue = value.replace(/[^0-9]/gi, '').slice(0, 4);
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.card_number || formData.card_number.replace(/\s/g, '').length < 13) {
            newErrors.card_number = 'Please enter a valid card number';
        }

        if (!formData.card_expiry || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.card_expiry)) {
            newErrors.card_expiry = 'Please enter expiry in MM/YY format';
        }

        if (!formData.card_cvv || formData.card_cvv.length < 3) {
            newErrors.card_cvv = 'Please enter a valid CVV';
        }

        if (!formData.cardholder_name.trim()) {
            newErrors.cardholder_name = 'Cardholder name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await window.apiClient.post('/api/payments/process', {
                service_provider_id: serviceProviderId,
                subscription_id: subscription.id,
                ...formData
            });

            if (response.data.success) {
                onSuccess(response.data);
            }
        } catch (err) {
            console.error('Payment failed:', err);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                alert('Payment processing failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 w-full max-w-2xl">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                        <p className="mt-2 text-gray-600">Complete your subscription payment</p>
                    </div>

                    {/* Subscription Summary */}
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-900">{subscription.heading}</h3>
                                <p 
                                  className="text-sm text-gray-600 mt-1 rich-text-content"
                                  dangerouslySetInnerHTML={{ __html: subscription.description }}
                                />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatAmount(subscription.amount)}
                                </div>
                                <div className="text-sm text-gray-600">{subscription.period}</div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Card Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="card_number"
                                    value={formData.card_number}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.card_number ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                            </div>
                            {errors.card_number && (
                                <p className="mt-1 text-sm text-red-600">{errors.card_number}</p>
                            )}
                        </div>

                        {/* Expiry and CVV */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiry Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="card_expiry"
                                    value={formData.card_expiry}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.card_expiry ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="MM/YY"
                                    maxLength="5"
                                />
                                {errors.card_expiry && (
                                    <p className="mt-1 text-sm text-red-600">{errors.card_expiry}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CVV <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="card_cvv"
                                    value={formData.card_cvv}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.card_cvv ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="123"
                                    maxLength="4"
                                />
                                {errors.card_cvv && (
                                    <p className="mt-1 text-sm text-red-600">{errors.card_cvv}</p>
                                )}
                            </div>
                        </div>

                        {/* Cardholder Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cardholder Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="cardholder_name"
                                value={formData.cardholder_name}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.cardholder_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="John Doe"
                            />
                            {errors.cardholder_name && (
                                <p className="mt-1 text-sm text-red-600">{errors.cardholder_name}</p>
                            )}
                        </div>

                        {/* Security Notice */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium text-gray-900 mb-1">Secure Payment</p>
                                    <p>Your payment information is encrypted and secure. We do not store your card details.</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-6 border-t">
                            <button
                                type="button"
                                onClick={onBack}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                ← Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                            >
                                {loading && (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loading ? 'Processing...' : `Pay ${formatAmount(subscription.amount)}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;







