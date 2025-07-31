import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import CountriesList from './admin/CountriesList';
import ThemesList from './admin/ThemesList';
import ServiceProvidersList from './admin/ServiceProvidersList';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        countries: 0,
        themes: 0,
        serviceProviders: 0
    });

    useEffect(() => {
        // Check if admin is logged in
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (!isLoggedIn) {
            window.location.href = '/admin/login';
            return;
        }

        // Fetch dashboard stats
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [countriesRes, themesRes, providersRes] = await Promise.all([
                fetch('/api/countries'),
                fetch('/api/themes'),
                fetch('/api/service-providers')
            ]);

            const countries = await countriesRes.json();
            const themes = await themesRes.json();
            const providers = await providersRes.json();

            setStats({
                countries: countries.length,
                themes: themes.length,
                serviceProviders: providers.length
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = '/admin/login';
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
                        <div className="max-w-7xl mx-auto">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Admin!</h1>
                                <p className="text-gray-600">Here's what's happening with your EcoTravel platform today.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Countries</p>
                                                <p className="text-2xl font-bold text-gray-900">{stats.countries}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600">{stats.countries}</div>
                                            <div className="text-xs text-gray-500">Total</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Themes</p>
                                                <p className="text-2xl font-bold text-gray-900">{stats.themes}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-emerald-600">{stats.themes}</div>
                                            <div className="text-xs text-gray-500">Total</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Service Providers</p>
                                                <p className="text-2xl font-bold text-gray-900">{stats.serviceProviders}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-purple-600">{stats.serviceProviders}</div>
                                            <div className="text-xs text-gray-500">Total</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Quick Actions
                                    </h2>
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => setActiveTab('countries')}
                                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between group"
                                        >
                                            <div className="flex items-center">
                                                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                                                    </svg>
                                                </div>
                                                <span className="font-medium text-gray-700">Manage Countries</span>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                        
                                        <button 
                                            onClick={() => setActiveTab('themes')}
                                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between group"
                                        >
                                            <div className="flex items-center">
                                                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 mr-3">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7z" />
                                                    </svg>
                                                </div>
                                                <span className="font-medium text-gray-700">Manage Themes</span>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                        
                                        <button 
                                            onClick={() => setActiveTab('service-providers')}
                                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between group"
                                        >
                                            <div className="flex items-center">
                                                <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <span className="font-medium text-gray-700">Manage Service Providers</span>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Platform Overview
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                                                <span className="text-sm font-medium text-gray-700">Total Countries</span>
                                            </div>
                                            <span className="text-lg font-bold text-emerald-600">{stats.countries}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                                <span className="text-sm font-medium text-gray-700">Total Themes</span>
                                            </div>
                                            <span className="text-lg font-bold text-blue-600">{stats.themes}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                                                <span className="text-sm font-medium text-gray-700">Total Service Providers</span>
                                            </div>
                                            <span className="text-lg font-bold text-purple-600">{stats.serviceProviders}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'countries':
                return <CountriesList />;
            case 'themes':
                return <ThemesList />;
            case 'service-providers':
                return <ServiceProvidersList />;
            default:
                return <div>Page not found</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
            <div className="flex-1 overflow-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard; 