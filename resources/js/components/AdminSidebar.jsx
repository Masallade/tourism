import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const location = useLocation();

    const menuItems = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            path: '/admin',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
            )
        },
        {
            id: 'countries',
            name: 'Countries',
            path: '/admin/countries',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 'themes',
            name: 'Themes',
            path: '/admin/themes',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7z" />
                </svg>
            )
        },
        {
            id: 'service-providers',
            name: 'Service Providers',
            path: '/admin/service-providers',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="w-64 bg-white shadow-lg">
            <div className="p-6">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="ml-3 text-xl font-bold text-gray-900">Unison Tour</h1>
                </div>
                <p className="mt-2 text-sm text-gray-600">Admin Panel</p>
            </div>

            <nav className="mt-6">
                <div className="px-3">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || 
                                       (item.path === '/admin' && location.pathname === '/admin/');
                        
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    isActive
                                        ? 'bg-green-100 text-green-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                {item.icon}
                                <span className="ml-3">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-6 px-3">
                    <LogoutButton className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors" />
                </div>
            </nav>
        </div>
    );
};

export default AdminSidebar; 