import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = ({ paymentData, onClose }) => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
        if (onClose) onClose();
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 w-full max-w-2xl">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Success Icon */}
                    <div className="text-center mb-6">
                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
                            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600">Your subscription has been activated</p>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Transaction ID:</span>
                                <span className="font-medium text-gray-900">{paymentData.transaction_id}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-600">Amount Paid:</span>
                                <span className="font-medium text-green-600 text-lg">
                                    {formatAmount(paymentData.payment.amount)}
                                </span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="font-medium text-gray-900">
                                    {paymentData.payment.card_brand} •••• {paymentData.payment.card_last_4}
                                </span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium text-gray-900">
                                    {formatDate(paymentData.payment.paid_at)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Details */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Subscription Details</h3>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Plan:</span>
                                <span className="font-medium text-gray-900">
                                    {paymentData.subscription.subscription.heading}
                                </span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-600">Start Date:</span>
                                <span className="font-medium text-gray-900">
                                    {formatDate(paymentData.subscription.starts_at)}
                                </span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-600">Expires On:</span>
                                <span className="font-medium text-gray-900">
                                    {formatDate(paymentData.subscription.expires_at)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-gray-700">
                                <p className="font-medium text-gray-900 mb-1">Pending Admin Approval</p>
                                <p>Your account is now pending approval from our admin team. You will receive an email notification once your account has been reviewed and approved. This usually takes 24-48 hours.</p>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Check your email for payment confirmation
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Wait for admin approval (24-48 hours)
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Once approved, you can log in to your provider dashboard
                            </li>
                        </ul>
                    </div>

                    {/* Action Button */}
                    <div className="text-center">
                        <button
                            onClick={handleGoHome}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Return to Homepage
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;







