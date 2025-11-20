import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { countryCodes } from '../../utils/countryCodes';

const AppSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [settings, setSettings] = useState({
        company_name: '',
        company_description: '',
        address: '',
        phone: '',
        country_code: '',
        email: '',
        twitter_url: '',
        instagram_url: '',
        linkedin_url: '',
        facebook_url: '',
        youtube_url: '',
        tiktok_url: '',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await window.apiClient.get('/api/app-settings');
            if (response.data) {
                setSettings({
                    company_name: response.data.company_name || '',
                    company_description: response.data.company_description || '',
                    address: response.data.address || '',
                    phone: response.data.phone || '',
                    country_code: response.data.country_code || '',
                    email: response.data.email || '',
                    twitter_url: response.data.twitter_url || '',
                    instagram_url: response.data.instagram_url || '',
                    linkedin_url: response.data.linkedin_url || '',
                    facebook_url: response.data.facebook_url || '',
                    youtube_url: response.data.youtube_url || '',
                    tiktok_url: response.data.tiktok_url || '',
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setErrorMessage('Failed to load settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            await window.apiClient.post('/api/app-settings', settings);
            setSuccessMessage('Settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">App Settings</h1>

            {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-green-700">{successMessage}</span>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-red-700">{errorMessage}</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                {/* Company Information */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Company Information</h2>
                    
                    <div className="mb-4">
                        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                        </label>
                        <input
                            type="text"
                            id="company_name"
                            name="company_name"
                            value={settings.company_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Unison Tour"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="company_description" className="block text-sm font-medium text-gray-700 mb-2">
                            Company Description
                        </label>
                        <textarea
                            id="company_description"
                            name="company_description"
                            value={settings.company_description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Discover sustainable travel experiences..."
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Contact Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={settings.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="123 Nature Way, Green City"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                            </label>
                            <div className="flex gap-2">
                                <select
                                    id="country_code"
                                    name="country_code"
                                    value={settings.country_code || ''}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Code</option>
                                    {countryCodes.map((cc) => (
                                        <option key={cc.code} value={cc.code}>
                                            {cc.code}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={settings.phone}
                                    onChange={handleChange}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={settings.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="info@ecotravel.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Social Media Links</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-700 mb-2">
                                Twitter URL
                            </label>
                            <input
                                type="url"
                                id="twitter_url"
                                name="twitter_url"
                                value={settings.twitter_url}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://twitter.com/yourhandle"
                            />
                        </div>

                        <div>
                            <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700 mb-2">
                                Instagram URL
                            </label>
                            <input
                                type="url"
                                id="instagram_url"
                                name="instagram_url"
                                value={settings.instagram_url}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://instagram.com/yourhandle"
                            />
                        </div>

                        <div>
                            <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-2">
                                LinkedIn URL
                            </label>
                            <input
                                type="url"
                                id="linkedin_url"
                                name="linkedin_url"
                                value={settings.linkedin_url}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://linkedin.com/company/yourcompany"
                            />
                        </div>

                        <div>
                            <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700 mb-2">
                                Facebook URL
                            </label>
                            <input
                                type="url"
                                id="facebook_url"
                                name="facebook_url"
                                value={settings.facebook_url}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>

                        <div>
                            <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-2">
                                YouTube URL
                            </label>
                            <input
                                type="url"
                                id="youtube_url"
                                name="youtube_url"
                                value={settings.youtube_url}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://youtube.com/@yourchannel"
                            />
                        </div>

                        <div>
                            <label htmlFor="tiktok_url" className="block text-sm font-medium text-gray-700 mb-2">
                                TikTok URL
                            </label>
                            <input
                                type="url"
                                id="tiktok_url"
                                name="tiktok_url"
                                value={settings.tiktok_url}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://tiktok.com/@yourhandle"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <ClipLoader color="#ffffff" size={20} className="mr-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                                </svg>
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppSettings;







