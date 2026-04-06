# Update Tourism Nginx Config

## Current Issue
Your `tourism` config is missing `client_max_body_size`, which is causing 413 errors.

## Quick Fix

### Step 1: Edit the config file

```bash
sudo nano /etc/nginx/sites-available/tourism
```

### Step 2: Add these 3 lines right after `server_name`

Add them after line 3 (`server_name 15.235.48.60;`):

```nginx
server {
    listen 80;
    server_name 15.235.48.60;

    # ========== ADD THESE 3 LINES ==========
    client_max_body_size 150M;
    client_body_timeout 300s;
    client_header_timeout 300s;
    # ========================================

    root /var/www/tourism/public;
    # ... rest of config ...
```

### Step 3: Also add FastCGI buffers (optional but recommended)

In the `location ~ \.php$` block, add these lines after `include fastcgi_params;`:

```nginx
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        
        # Add these for large uploads:
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
        fastcgi_read_timeout 300s;
    }
```

### Step 4: Test and reload

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Verify

```bash
sudo nginx -T | grep -A 10 "server_name 15.235.48.60" | grep client_max_body_size
```

Should show: `client_max_body_size 150M;`

## Complete Updated Config

Your complete config should look like this:

```nginx
server {
    listen 80;
    server_name 15.235.48.60;

    client_max_body_size 150M;
    client_body_timeout 300s;
    client_header_timeout 300s;

    root /var/www/tourism/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
        fastcgi_read_timeout 300s;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## Also Check Default Config

The error log showed `php8.3-fpm.sock` being used, which might be from the `default` config. Check and fix it:

```bash
# Check if default config has php8.3
sudo grep "php8.3" /etc/nginx/sites-available/default

# If found, fix it:
sudo sed -i 's|php8.3-fpm.sock|php8.2-fpm.sock|g' /etc/nginx/sites-available/default
sudo nginx -t && sudo systemctl reload nginx
```


