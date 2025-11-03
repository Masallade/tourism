// Centralized API utility for consistent API calls
import axios from 'axios';

// Create axios instance with proper configuration
const api = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
    },
    // Send cookies with requests (for Laravel session-based auth)
    withCredentials: true,
});

// Set base URL based on environment
if (import.meta.env.PROD) {
    // Production: Use the current domain
    api.defaults.baseURL = window.location.origin;
} else {
    // Development: Use the same origin as the page to ensure cookies work
    // This handles both localhost and 127.0.0.1 automatically
    api.defaults.baseURL = window.location.origin;
}

// Add request interceptor to include CSRF token and check for token-based auth (fallback)
api.interceptors.request.use(
    (config) => {
        // Remove Content-Type header for FormData - axios will set it automatically with boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
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
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            
            // Only redirect GET requests or if the error was from a page load
            // Don't redirect for DELETE/POST/PUT operations to prevent unwanted navigation
            const requestMethod = error.config?.method?.toUpperCase();
            const isPageRequest = requestMethod === 'GET' || !requestMethod;
            
            // Determine if we're in admin panel and redirect accordingly
            const isAdminRoute = window.location.pathname.startsWith('/admin');
            const loginPath = isAdminRoute ? '/admin/login' : '/login';
            
            // Only redirect if:
            // 1. Not already on login page (prevent loops)
            // 2. It's a GET request or page load (not a DELETE/POST/PUT operation)
            if (isPageRequest && !window.location.pathname.includes('login')) {
                // Use setTimeout to prevent axios from following redirects
                setTimeout(() => {
                    window.location.href = loginPath;
                }, 100);
            }
        }
        return Promise.reject(error);
    }
);

// Export API methods
export const apiClient = {
    // GET requests
    get: (url, config = {}) => api.get(url, config),
    
    // POST requests
    post: (url, data = {}, config = {}) => api.post(url, data, config),
    
    // PUT requests
    put: (url, data = {}, config = {}) => api.put(url, data, config),
    
    // PATCH requests
    patch: (url, data = {}, config = {}) => api.patch(url, data, config),
    
    // DELETE requests
    delete: (url, config = {}) => api.delete(url, config),
    
    // File upload requests
    upload: (url, formData, config = {}) => {
        // Don't set Content-Type for FormData - axios will set it automatically with boundary
        return api.post(url, formData, config);
    },
};

export default apiClient;



