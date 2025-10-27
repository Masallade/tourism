<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Tourism App</title>
    @vite('resources/js/app.jsx')
</head>
<body class="antialiased">
    <div id="app"></div>
    
    @if(session('google_login_success'))
    <script>
        // Handle Google login success
        document.addEventListener('DOMContentLoaded', function() {
            const userData = @json(session('user_data'));
            if (userData) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('Google login success, user data stored:', userData);
                
                // Trigger a custom event to notify React components
                window.dispatchEvent(new CustomEvent('googleLoginSuccess', { detail: userData }));
            }
        });
    </script>
    @endif
</body>
</html>
