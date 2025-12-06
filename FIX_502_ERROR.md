# Fix: 502 Bad Gateway Error

## Problem
After updating Nginx config, getting "502 Bad Gateway" - Nginx can't communicate with PHP-FPM.

## Quick Diagnostic Commands

Run these on your server to find the issue:

### Step 1: Check PHP-FPM Status

```bash
# Check if PHP-FPM is running
sudo systemctl status php8.2-fpm

# Or check all PHP-FPM versions
sudo systemctl status php8.1-fpm
sudo systemctl status php8.2-fpm
```

### Step 2: Check PHP-FPM Socket

```bash
# List available PHP-FPM sockets
ls -la /run/php/php*-fpm.sock

# Check permissions
ls -l /run/php/
```

### Step 3: Check Nginx Error Logs

```bash
# View recent errors
sudo tail -50 /var/log/nginx/error.log

# Watch logs in real-time
sudo tail -f /var/log/nginx/error.log
```

### Step 4: Check PHP-FPM Error Logs

```bash
# Check PHP-FPM logs
sudo tail -50 /var/log/php8.2-fpm.log
# Or
sudo journalctl -u php8.2-fpm -n 50
```

## Common Fixes

### Fix 1: PHP-FPM Not Running

```bash
# Start PHP-FPM
sudo systemctl start php8.2-fpm
sudo systemctl enable php8.2-fpm

# Check status
sudo systemctl status php8.2-fpm
```

### Fix 2: Wrong PHP Version in Config

Check which PHP version you're using:

```bash
# See available sockets
ls /run/php/php*-fpm.sock

# Check which PHP-FPM is running
ps aux | grep php-fpm
```

Then update your Nginx config to match:

```bash
sudo nano /etc/nginx/sites-available/tourism
```

Make sure `fastcgi_pass` matches your PHP version:
- If you have `php8.2-fpm.sock`: `fastcgi_pass unix:/run/php/php8.2-fpm.sock;`
- If you have `php8.1-fpm.sock`: `fastcgi_pass unix:/run/php/php8.1-fpm.sock;`

### Fix 3: Socket Permissions

```bash
# Fix socket permissions
sudo chown www-data:www-data /run/php/php*-fpm.sock
sudo chmod 666 /run/php/php*-fpm.sock

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm
```

### Fix 4: Check PHP Location Block Syntax

Make sure your PHP location block is correct:

```nginx
location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php8.2-fpm.sock;  # Match your PHP version
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}
```

## Quick Recovery Steps

If site is completely down:

```bash
# 1. Check what broke
sudo nginx -t
sudo tail -20 /var/log/nginx/error.log

# 2. Check PHP-FPM
sudo systemctl status php8.2-fpm

# 3. If PHP-FPM is down, start it
sudo systemctl start php8.2-fpm

# 4. If config is wrong, check the tourism config
sudo cat /etc/nginx/sites-available/tourism | grep -A 10 "location ~ \.php"
```




