# Debug: client_max_body_size Not Active

## Problem
- ✅ Setting exists in `/etc/nginx/sites-available/default`
- ✅ Nginx test passes
- ✅ Nginx reloaded
- ❌ But `nginx -T` doesn't show `client_max_body_size`

This means the setting isn't being loaded into the active configuration.

## Diagnostic Steps

### Step 1: Check Which Config Files Are Enabled

```bash
ls -la /etc/nginx/sites-enabled/
```

The config file must be **symlinked** from `sites-available` to `sites-enabled` to be active.

### Step 2: Check If Default is Enabled

```bash
ls -la /etc/nginx/sites-enabled/default
```

If it doesn't exist, you need to enable it:
```bash
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
```

### Step 3: Check All Active Server Blocks

```bash
sudo nginx -T | grep -A 20 "server {"
```

This shows all active server blocks. Check if your `client_max_body_size` is in the right server block.

### Step 4: Check Main nginx.conf

Sometimes the main config file has a global setting that overrides:

```bash
sudo grep "client_max_body_size" /etc/nginx/nginx.conf
```

If it's set to a low value here, it might override site configs.

### Step 5: Check for Multiple Server Blocks

Your config might have multiple `server { }` blocks. Make sure `client_max_body_size` is in the **default_server** block:

```bash
sudo cat /etc/nginx/sites-available/default | grep -B 10 -A 30 "listen 80 default_server"
```

### Step 6: Verify Setting Location

The setting must be **inside** the `server { }` block, not outside:

```bash
# Check the structure
sudo cat /etc/nginx/sites-available/default | head -50
```

Make sure it looks like:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    client_max_body_size 150M;  # ← Inside server block
    
    root /var/www/tourism/public;
    # ...
}
```

NOT:
```nginx
client_max_body_size 150M;  # ← WRONG: Outside server block

server {
    listen 80 default_server;
    # ...
}
```

## Quick Fix Commands

Run these in order:

```bash
# 1. Make sure default is enabled
sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# 2. Check for other enabled sites that might conflict
ls -la /etc/nginx/sites-enabled/

# 3. Test config
sudo nginx -t

# 4. Reload nginx
sudo systemctl reload nginx

# 5. Check active config again
sudo nginx -T | grep "client_max_body_size"
```

## Alternative: Add to Main nginx.conf

If site config doesn't work, add it globally in main config:

```bash
sudo nano /etc/nginx/nginx.conf
```

Find the `http {` block and add:
```nginx
http {
    client_max_body_size 150M;  # Add here
    
    # ... rest of config ...
}
```

Then reload:
```bash
sudo nginx -t && sudo systemctl reload nginx
```
















