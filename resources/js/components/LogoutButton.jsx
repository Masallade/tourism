import React, { useState } from 'react';
import auth from '../utils/auth';

const LogoutButton = ({ className = "" }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            setIsLoggingOut(true);
            await auth.logout();
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 ${className}`}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
    );
};

export default LogoutButton;



