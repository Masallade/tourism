import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import auth from '../utils/auth';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Initialize and check session
                const isValid = await auth.initializeSession();
                
                if (!isValid) {
                    window.location.href = '/admin/login';
                    return;
                }

                // Get current user info
                const currentUser = auth.getUser();
                
                if (!currentUser) {
                    window.location.href = '/admin/login';
                    return;
                }

                // Check admin requirement
                if (requireAdmin && currentUser.role !== 'admin') {
                    window.location.href = '/admin/login';
                    return;
                }

                setUser(currentUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth check error:', error);
                window.location.href = '/admin/login';
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [requireAdmin]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <ClipLoader color="#10b981" size={60} speedMultiplier={0.9} />
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect to login
    }

    return children;
};

export default ProtectedRoute;
