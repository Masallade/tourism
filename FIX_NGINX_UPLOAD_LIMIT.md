# Fix: Nginx 413 Request Entity Too Large Error

## Problem
Error: `413 Request Entity Too Large` from `nginx/1.18.0 (Ubuntu)`

This is an **Nginx server configuration issue**, not PHP. Nginx has its own upload size limit that's separate from PHP settings.

## Solution: Update Nginx client_max_body_size

### Step 1: Find Your Nginx Configuration File

Nginx configuration is typically in one of these locations:
- `/etc/nginx/nginx.conf` (main config)
- `/etc/nginx/sites-available/default` (default site)
- `/etc/nginx/sites-available/your-site-name` (your specific site)

### Step 2: Update client_max_body_size

**Option A: Update Main Nginx Config (Recommended)**

1. SSH into your Ubuntu server
2. Edit the main config:
   ```bash
   sudo nano /etc/nginx/nginx.conf
   ```
3. Find the `http` block and add/update:
   ```nginx
   http {
       # ... other settings ...
       client_max_body_size 100M;  # Add this line
       # ... rest of config ...
   }
   ```

**Option B: Update Site-Specific Config**

1. Find your site config:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   # OR
   sudo nano /etc/nginx/sites-available/your-site-name
   ```
2. Add inside the `server` block:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       client_max_body_size 100M;  # Add this line
       
       # ... rest of config ...
   }
   ```

### Step 3: Test Nginx Configuration

Before restarting, test that your config is valid:
```bash
sudo nginx -t
```

You should see:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Step 4: Reload Nginx

If the test passes, reload Nginx:
```bash
sudo systemctl reload nginx
# OR
sudo service nginx reload
```

**Important:** Use `reload` instead of `restart` to avoid downtime.

### Step 5: Verify the Change

Check if the setting was applied:
```bash
sudo nginx -T | grep client_max_body_size
```

You should see: `client_max_body_size 100M;`

## Recommended Values

For your application (7 documents × 10MB each):
- **Minimum**: `client_max_body_size 100M;` (allows 7 × 10MB + image + form data)
- **Recommended**: `client_max_body_size 150M;` (with buffer)
- **Safe**: `client_max_body_size 200M;` (plenty of room)

## Complete Example Configuration

Here's a complete `server` block example:

```nginx
server {
    listen 80;
    server_name unisontour.com www.unisontour.com;
    
    # Upload size limit
    client_max_body_size 150M;
    
    # Timeouts for large uploads
    client_body_timeout 300s;
    client_header_timeout 300s;
    
    root /var/www/tourism/public;
    index index.php index.html;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        
        # Also increase FastCGI buffer sizes
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
    }
}
```

## Also Check PHP-FPM Settings

Since you're using Nginx with PHP-FPM, also verify PHP settings:

1. Check PHP-FPM config:
   ```bash
   sudo nano /etc/php/8.3/fpm/php.ini
   ```
2. Ensure these values:
   ```ini
   upload_max_filesize = 100M
   post_max_size = 150M
   max_file_uploads = 20
   memory_limit = 512M
   ```
3. Restart PHP-FPM:
   ```bash
   sudo systemctl restart php8.3-fpm
   ```

## Troubleshooting

### If reload fails:
```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check for syntax errors
sudo nginx -t
```

### If still getting 413 after changes:
1. Make sure you edited the correct config file (the one your site uses)
2. Verify the setting is in the right block (`http` or `server`)
3. Clear browser cache
4. Check if there are multiple `client_max_body_size` directives (the last one wins)

### Verify which config file is active:
```bash
# See all active configs
sudo nginx -T | grep -A 5 "server_name unisontour.com"
```

## Quick Command Summary

```bash
# 1. Edit config
sudo nano /etc/nginx/sites-available/default

# 2. Add: client_max_body_size 150M;

# 3. Test config
sudo nginx -t

# 4. Reload Nginx
sudo systemctl reload nginx

# 5. Verify
sudo nginx -T | grep client_max_body_size
```

## After Fixing

Your application will support:
- ✅ Up to 7 documents
- ✅ Each document up to 10MB
- ✅ Total upload size up to 150MB (with buffer)

The 9.69MB upload should now work! 🎉



















