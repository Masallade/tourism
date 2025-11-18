#!/bin/bash
# Server Deployment Script for Tourism Project
# Run this on the server: bash DEPLOY_SERVER.sh

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/tourism

# 1. Pull latest code from GitHub
echo "📥 Pulling latest code from GitHub..."
git pull origin stable || git pull origin main

# 2. Install/Update Composer dependencies
echo "📦 Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

# 3. Install/Update NPM dependencies
echo "📦 Installing NPM dependencies..."
npm ci --production=false

# 4. Build frontend assets
echo "🔨 Building frontend assets..."
npm run build

# 5. Run database migrations (if any)
echo "🗄️  Running database migrations..."
php artisan migrate --force

# 6. Clear all caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# 7. Optimize for production (optional but recommended)
echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 8. Ensure storage symlink exists
echo "🔗 Checking storage symlink..."
if [ ! -L public/storage ]; then
    echo "Creating storage symlink..."
    rm -rf public/storage
    php artisan storage:link
fi

# 9. Fix permissions
echo "🔐 Setting correct permissions..."
sudo chown -R ubuntu:ubuntu /var/www/tourism
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
sudo chmod 664 .env

# 10. Restart PHP-FPM
echo "🔄 Restarting PHP-FPM..."
sudo systemctl restart php8.2-fpm

# 11. Restart queue workers (if using supervisor)
echo "🔄 Restarting queue workers..."
sudo pkill -f "queue:work" || true
sudo systemctl restart supervisor || true

# Or start queue worker manually if not using supervisor:
# php artisan queue:work --daemon &

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should now be updated at http://15.235.48.60"




