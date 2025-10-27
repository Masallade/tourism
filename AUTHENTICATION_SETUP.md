# Authentication System Setup

This document outlines the comprehensive authentication and session management system implemented for the Unison Tour application.

## Features Implemented

### ✅ **User Authentication**
- **Login/Logout**: Secure authentication with email and password
- **Role-based Access**: Admin and user roles with proper permissions
- **Session Management**: Secure session handling with Laravel sessions
- **Password Security**: Hashed passwords with Laravel's built-in hashing

### ✅ **Security Features**
- **CSRF Protection**: All forms protected against CSRF attacks
- **Middleware Protection**: Admin routes protected with custom middleware
- **Session Security**: Secure session configuration
- **Input Validation**: Comprehensive validation for all inputs

### ✅ **User Management**
- **User Roles**: Admin and regular user roles
- **User Registration**: Admin-only user creation
- **Password Management**: Secure password change functionality
- **Session Persistence**: Remember me functionality

## Database Setup

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Seed Admin Users
```bash
php artisan db:seed --class=AdminUserSeeder
```

### 3. Seed All Data
```bash
php artisan db:seed
```

## Default Admin Credentials

### Admin User
- **Email**: `admin@unison-tour.com`
- **Password**: `admin123`
- **Role**: `admin`

### Test User
- **Email**: `test@unison-tour.com`
- **Password**: `test123`
- **Role**: `user`

## API Endpoints

### Authentication Routes
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/register` - Register new user (admin only)

### Protected Routes
All admin routes are protected with `admin.auth` middleware:
- `POST /api/countries` - Create country
- `PUT /api/countries/{id}` - Update country
- `DELETE /api/countries/{id}` - Delete country
- `POST /api/themes` - Create theme
- `PUT /api/themes/{id}` - Update theme
- `DELETE /api/themes/{id}` - Delete theme

## Frontend Components

### Authentication Components
- **AdminLogin**: Login form with real authentication
- **ProtectedRoute**: Route protection component
- **LogoutButton**: Secure logout functionality

### Utility Functions
- **auth.js**: Comprehensive authentication utilities
  - `auth.login()` - User login
  - `auth.logout()` - User logout
  - `auth.isAuthenticated()` - Check authentication status
  - `auth.isAdmin()` - Check admin role
  - `auth.getCurrentUser()` - Get current user info
  - `auth.changePassword()` - Change password
  - `auth.checkSession()` - Validate session

## Security Configuration

### Session Configuration
- **Driver**: Database sessions
- **Lifetime**: 120 minutes (configurable)
- **Secure**: HTTPS only in production
- **HttpOnly**: Prevents XSS attacks
- **SameSite**: CSRF protection

### Password Requirements
- **Minimum Length**: 8 characters
- **Hashing**: Laravel's bcrypt hashing
- **Confirmation**: Password confirmation required

### Middleware Protection
- **AdminAuth**: Protects admin routes
- **CSRF**: All forms protected
- **Session**: Secure session handling

## Usage Examples

### Login User
```javascript
import auth from './utils/auth';

const result = await auth.login('admin@unison-tour.com', 'admin123');
if (result.success) {
    console.log('Logged in:', result.user);
} else {
    console.error('Login failed:', result.message);
}
```

### Check Authentication
```javascript
if (auth.isAuthenticated() && auth.isAdmin()) {
    // User is authenticated admin
    console.log('Current user:', auth.getUser());
}
```

### Logout User
```javascript
await auth.logout(); // Redirects to login page
```

### Change Password
```javascript
const result = await auth.changePassword('oldpassword', 'newpassword');
if (result.success) {
    console.log('Password changed successfully');
}
```

## Route Protection

### Admin Routes
All admin routes are automatically protected:
```php
Route::get('/admin', function () {
    return view('welcome');
})->middleware('admin.auth');
```

### API Protection
Admin API routes are protected:
```php
Route::post('/countries', [CountryController::class, 'store'])
    ->middleware('admin.auth');
```

## Session Management

### Automatic Session Handling
- Sessions are automatically managed by Laravel
- User authentication persists across requests
- Session timeout after inactivity
- Secure session regeneration on login

### Session Security
- **Regeneration**: Session ID regenerated on login
- **Invalidation**: Session invalidated on logout
- **Timeout**: Automatic timeout after inactivity
- **CSRF**: CSRF tokens for all forms

## Error Handling

### Authentication Errors
- **401 Unauthorized**: Invalid credentials
- **403 Forbidden**: Insufficient permissions
- **422 Validation Error**: Invalid input data
- **500 Server Error**: Internal server errors

### Frontend Error Handling
- Network error handling
- Authentication state management
- Automatic redirects on auth failure
- User-friendly error messages

## Testing

### Manual Testing
1. **Login Test**: Try logging in with admin credentials
2. **Role Test**: Verify admin-only access
3. **Session Test**: Check session persistence
4. **Logout Test**: Verify secure logout
5. **Protection Test**: Try accessing protected routes

### Security Testing
1. **CSRF Test**: Verify CSRF protection
2. **Session Test**: Check session security
3. **Role Test**: Verify role-based access
4. **Timeout Test**: Check session timeout

## Troubleshooting

### Common Issues
1. **CSRF Token Mismatch**: Ensure CSRF token is included in forms
2. **Session Expired**: Check session configuration
3. **Permission Denied**: Verify user role and permissions
4. **Login Failed**: Check credentials and user status

### Debug Steps
1. Check browser console for errors
2. Verify API responses
3. Check session storage
4. Validate user permissions

## Production Considerations

### Security Checklist
- [ ] HTTPS enabled
- [ ] Secure session configuration
- [ ] CSRF protection enabled
- [ ] Password requirements enforced
- [ ] Role-based access implemented
- [ ] Session timeout configured
- [ ] Error handling implemented

### Performance Optimization
- Database session storage
- Efficient middleware
- Cached authentication checks
- Optimized API responses

## Support

For issues or questions regarding the authentication system:
1. Check the Laravel documentation
2. Review the authentication logs
3. Test with the provided credentials
4. Verify database setup and migrations



