# Step-by-Step: Update Nginx Configuration on Ubuntu Server

## Current Situation
Your Nginx config is the default Ubuntu template. You need to:
1. ✅ Add `client_max_body_size` to fix 413 error
2. ✅ Enable PHP processing
3. ✅ Configure Laravel routing
4. ✅ Update document root

## Step 1: Backup Current Config

```bash
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
```

## Step 2: Edit Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/default
```

## Step 3: Replace the `server` Block

Replace the entire `server { ... }` block with the updated version from `nginx_default_updated.conf`.

**OR** manually add these lines:

### A. Add Upload Size Limit (FIXES 413 ERROR)

Inside the `server {` block, add at the top:

```nginx
client_max_body_size 150M;
client_body_timeout 300s;
client_header_timeout 300s;
```

### B. Update Root Directory

Change:
```nginx
root /var/www/html;
```

To your Laravel public directory:
```nginx
root /var/www/tourism/public;
```

**Find your actual path:**
```bash
# If you're not sure, find it:
find /var/www -name "artisan" -type f 2>/dev/null
# This will show: /var/www/tourism/artisan
# So public directory is: /var/www/tourism/public
```

### C. Update Index

Change:
```nginx
index index.html index.htm index.nginx-debian.html;
```

To:
```nginx
index index.php index.html index.htm index.nginx-debian.html;
```

### D. Update Location Block

Change:
```nginx
location / {
    try_files $uri $uri/ =404;
}
```

To:
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

### E. Enable PHP Processing

Uncomment and update the PHP location block:

```nginx
location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    
    # Find your PHP version:
    # ls /run/php/php*-fpm.sock
    
    fastcgi_pass unix:/run/php/php8.3-fpm.sock;  # Update version if needed
    
    # Add these for large uploads:
    fastcgi_buffer_size 128k;
    fastcgi_buffers 4 256k;
    fastcgi_busy_buffers_size 256k;
    fastcgi_read_timeout 300s;
}
```

**Find your PHP version:**
```bash
ls /run/php/php*-fpm.sock
# Output might be: php8.1-fpm.sock or php8.3-fpm.sock
```

### F. Update Server Name (Optional)

Change:
```nginx
server_name _;
```

To your domain:
```nginx
server_name unisontour.com www.unisontour.com;
```

## Step 4: Test Configuration

```bash
sudo nginx -t
```

You should see:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

## Step 5: Reload Nginx

```bash
sudo systemctl reload nginx
```

## Step 6: Verify PHP-FPM is Running

```bash
# Check PHP-FPM status
sudo systemctl status php8.3-fpm

# If not running, start it:
sudo systemctl start php8.3-fpm
sudo systemctl enable php8.3-fpm
```

## Step 7: Check PHP-FPM php.ini

```bash
# Edit PHP-FPM php.ini
sudo nano /etc/php/8.3/fpm/php.ini
```

Find and update:
```ini
upload_max_filesize = 100M
post_max_size = 150M
max_file_uploads = 20
memory_limit = 512M
```

Restart PHP-FPM:
```bash
sudo systemctl restart php8.3-fpm
```

## Step 8: Set Proper Permissions

```bash
# Set ownership (replace 'www-data' with your web server user if different)
sudo chown -R www-data:www-data /var/www/tourism
sudo chmod -R 755 /var/www/tourism
sudo chmod -R 775 /var/www/tourism/storage
sudo chmod -R 775 /var/www/tourism/bootstrap/cache
```

## Step 9: Test Your Site

Visit your site in browser:
- `http://your-server-ip`
- `http://unisontour.com`

Try uploading a service provider with documents.

## Troubleshooting

### If nginx -t fails:
```bash
# Check error details
sudo nginx -t

# Common issues:
# - Syntax error: Check for missing semicolons
# - File not found: Check paths are correct
```

### If site shows 502 Bad Gateway:
```bash
# PHP-FPM might not be running
sudo systemctl status php8.3-fpm

# Check PHP-FPM socket exists
ls -la /run/php/php*-fpm.sock

# Restart PHP-FPM
sudo systemctl restart php8.3-fpm
```

### If still getting 413 error:
```bash
# Verify client_max_body_size is set
sudo nginx -T | grep client_max_body_size

# Should show: client_max_body_size 150M;
```

### Check Nginx error logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

## Quick Reference Commands

```bash
# Edit config
sudo nano /etc/nginx/sites-available/default

# Test config
sudo nginx -t

# Reload Nginx (no downtime)
sudo systemctl reload nginx

# Restart Nginx (brief downtime)
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx

# Check PHP-FPM status
sudo systemctl status php8.3-fpm

# View error logs
sudo tail -f /var/log/nginx/error.log
```

## After Fixing

Your configuration should now:
- ✅ Allow uploads up to 150MB
- ✅ Process PHP files correctly
- ✅ Route Laravel requests properly
- ✅ Support 7 documents × 10MB each

The 413 error should be resolved! 🎉
















