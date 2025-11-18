# 🚀 Server Deployment Commands

Run these commands on your VPS server to update the code.

## Step-by-Step Commands

```bash
# 1. SSH into your server
ssh -i ~/pierre ubuntu@15.235.48.60

# 2. Navigate to project directory
cd /var/www/tourism

# 3. Pull latest code from GitHub
git pull origin stable
# OR if you're on main branch:
# git pull origin main

# 4. Install/Update Composer dependencies
composer install --no-dev --optimize-autoloader

# 5. Install/Update NPM dependencies
npm ci

# 6. Build frontend assets
npm run build

# 7. Run database migrations (if any new migrations exist)
php artisan migrate --force

# 8. Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# 9. Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 10. Ensure storage symlink exists
if [ ! -L public/storage ]; then
    rm -rf public/storage
    php artisan storage:link
fi

# 11. Fix permissions
sudo chown -R ubuntu:ubuntu /var/www/tourism
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
sudo chmod 664 .env

# 12. Restart PHP-FPM
sudo systemctl restart php8.2-fpm

# 13. Restart queue workers (if using supervisor)
sudo pkill -f "queue:work" || true
sudo systemctl restart supervisor || true

# OR start queue worker manually if not using supervisor:
# nohup php artisan queue:work --daemon > /dev/null 2>&1 &
```

## Quick One-Liner (Copy-Paste All at Once)

```bash
cd /var/www/tourism && \
git pull origin stable && \
composer install --no-dev --optimize-autoloader && \
npm ci && \
npm run build && \
php artisan migrate --force && \
php artisan config:clear && \
php artisan cache:clear && \
php artisan route:clear && \
php artisan view:clear && \
php artisan config:cache && \
php artisan route:cache && \
php artisan view:cache && \
([ -L public/storage ] || (rm -rf public/storage && php artisan storage:link)) && \
sudo chown -R ubuntu:ubuntu /var/www/tourism && \
sudo chown -R www-data:www-data storage bootstrap/cache && \
sudo chmod -R 775 storage bootstrap/cache && \
sudo chmod 664 .env && \
sudo systemctl restart php8.2-fpm && \
(sudo pkill -f "queue:work" || true) && \
(sudo systemctl restart supervisor || true) && \
echo "✅ Deployment completed!"
```

## Notes

- Replace `stable` with `main` if your default branch is `main`
- The `--force` flag on migrations skips confirmation prompts
- `npm ci` is faster and more reliable than `npm install` for production
- Queue workers need to be restarted to pick up code changes
- PHP-FPM restart ensures new code is loaded




