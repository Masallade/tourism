import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
    useEffect(() => {
        // Check if admin is logged in
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (!isLoggedIn) {
            window.location.href = '/admin/login';
            return;
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = '/admin/login';
    };


    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar onLogout={handleLogout} />
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard; 