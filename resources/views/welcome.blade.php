<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Tourism App</title>
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <link rel="icon" type="image/png" href="{{ asset('favicon.ico') }}">
    <link rel="apple-touch-icon" href="{{ asset('favicon.svg') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
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
