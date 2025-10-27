
import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import ServiceProviderDashboard from './ServiceProviderDashboard';

const ServiceProviderLogin = ({ onLogin, onBack = null }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch('/api/service-provider-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Login failed');
            } else {
                setProvider(data.provider);
                if (onLogin) onLogin(data.provider);
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    if (provider) {
        return <ServiceProviderDashboard provider={provider} />;
    }

    return (
        <form onSubmit={handleSubmit} className="p-8 max-w-md mx-auto bg-white rounded-xl shadow mt-10 space-y-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Service Provider Login</h2>
            {error && <div className="bg-red-100 text-red-700 p-2 rounded text-center">{error}</div>}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 text-green-900 placeholder:text-green-400 font-medium shadow-sm transition border-green-200"
                    required
                />
            </div>
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 text-green-900 placeholder:text-green-400 font-medium shadow-sm transition border-green-200 pr-12"
                    required
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center text-green-600 hover:text-green-800 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.875-4.575A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.575-1.125M3 3l18 18" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7-2C20.243 7.062 16.418 4 12 4S3.757 7.062 1 10c2.757 2.938 6.582 6 11 6s8.243-3.062 11-6z" /></svg>
                    )}
                </button>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-60 transition"
            >
                {loading ? <ClipLoader color="#fff" size={22} speedMultiplier={0.9} /> : 'Login'}
            </button>
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className="w-full py-2 px-4 text-blue-700 bg-blue-100 border-2 border-blue-300 rounded-lg font-semibold hover:bg-blue-200 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Go Back
                </button>
            )}
        </form>
    );
};

export default ServiceProviderLogin;
