// Authentication utility functions
export const auth = {
    // Check if user is authenticated
    isAuthenticated() {
        // Check for admin login
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            return true;
        }
        
        // Check for regular user (has user data in localStorage)
        const user = this.getUser();
        return user !== null;
    },

    // Get current user
    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is admin
    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    },

    // Login user
    async login(email, password, remember = false) {
        try {
            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin', // Ensure cookies are sent
                body: JSON.stringify({
                    email,
                    password,
                    remember
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    },

    // Logout user
    async logout() {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('user');
            // Redirect to home page for regular users, admin login for admins
            const user = this.getUser();
            if (user && user.role === 'admin') {
                window.location.href = '/admin/login';
            } else {
                window.location.href = '/';
            }
        }
    },

    // Get current user info
    async getCurrentUser() {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin' // Ensure cookies are sent
            });

            const data = await response.json();
            console.log('Auth check response:', data); // Debug log

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                return data.user;
            } else {
                console.log('Auth failed, clearing session'); // Debug log
                this.clearSession();
                return null;
            }
        } catch (error) {
            console.error('Get user error:', error);
            this.clearSession();
            return null;
        }
    },

    // Register new user
    async register(name, email, password, password_confirmation) {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    },

    // Change password
    async changePassword(currentPassword, newPassword) {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    password: newPassword,
                    password_confirmation: newPassword
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Change password error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    },

    // Check session validity
    async checkSession() {
        if (!this.isAuthenticated()) {
            return false;
        }

        try {
            const user = await this.getCurrentUser();
            if (user && user.role === 'admin') {
                return true;
            } else {
                // Clear invalid session
                this.clearSession();
                return false;
            }
        } catch (error) {
            console.error('Session check error:', error);
            this.clearSession();
            return false;
        }
    },

    // Clear session data
    clearSession() {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('user');
    },

    // Initialize session check
    async initializeSession() {
        try {
            // First check if we have admin login
            if (localStorage.getItem('adminLoggedIn') === 'true') {
                const isValid = await this.checkSession();
                if (!isValid) {
                    this.clearSession();
                }
                return isValid;
            }
            
            // For regular users, check server-side session
            const user = await this.getCurrentUser();
            if (user) {
                // Store user data in localStorage for consistency
                localStorage.setItem('user', JSON.stringify(user));
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Session initialization error:', error);
            this.clearSession();
            return false;
        }
    }
};

export default auth;
