import axios from 'axios';
import apiClient from './utils/api';

// Make axios available globally for backward compatibility
window.axios = axios;

// Make apiClient available globally for new components
window.apiClient = apiClient;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Send cookies with requests (for Laravel session-based auth)
window.axios.defaults.withCredentials = true;

// Set base URL for API calls based on environment
if (import.meta.env.PROD) {
    // Production: Use the current domain
    window.axios.defaults.baseURL = window.location.origin;
} else {
    // Development: Use the same origin as the page to ensure cookies work
    // This handles both localhost and 127.0.0.1 automatically
    window.axios.defaults.baseURL = window.location.origin;
}

// Add request interceptor to include CSRF token and auth token for window.axios (backward compatibility)
window.axios.interceptors.request.use(
    (config) => {
        // Get CSRF token from meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            config.headers['X-CSRF-TOKEN'] = csrfToken;
        }
        
        // Check for token-based auth (for service providers or API tokens)
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
window.axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            
            // Only redirect GET requests (not DELETE/POST/PUT operations)
            const requestMethod = error.config?.method?.toUpperCase();
            const isPageRequest = requestMethod === 'GET' || !requestMethod;
            
            const isAdminRoute = window.location.pathname.startsWith('/admin');
            const loginPath = isAdminRoute ? '/admin/login' : '/login';
            
            if (isPageRequest && !window.location.pathname.includes('login')) {
                setTimeout(() => {
                    window.location.href = loginPath;
                }, 100);
            } else {
                // Log error for non-GET requests instead of redirecting
                console.error('Unauthorized: Please login again');
            }
        }
        return Promise.reject(error);
    }
);
