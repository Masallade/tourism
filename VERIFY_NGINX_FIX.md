# Verify Nginx Configuration is Applied

## Problem
- ✅ PHP settings are correct: `post_max_size: 120M`
- ❌ Still getting 413 error with 8MB limit
- ❌ Nginx `client_max_body_size` not applied

## Step 1: Verify Nginx Config Was Updated

SSH into your server and check if `client_max_body_size` is in the active config:

```bash
# Check the active configuration
sudo nginx -T | grep client_max_body_size
```

**Expected output:**
```
client_max_body_size 150M;
```

**If you see nothing or 8M:**
- The config wasn't saved properly
- Or you edited the wrong file
- Or nginx wasn't reloaded

## Step 2: Check Which Config File is Active

```bash
# See all active server blocks
sudo nginx -T | grep -A 10 "server_name"

# Or check which site is enabled
ls -la /etc/nginx/sites-enabled/
```

## Step 3: Verify Your Config File Has the Setting

```bash
# Check the default config file
sudo grep -n "client_max_body_size" /etc/nginx/sites-available/default

# Should show line number and: client_max_body_size 150M;
```

## Step 4: If Setting is Missing, Add It

```bash
# Edit the config
sudo nano /etc/nginx/sites-available/default
```

**Make sure this line is INSIDE the `server {` block, right after the listen directives:**

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    client_max_body_size 150M;  # ← THIS LINE MUST BE HERE
    client_body_timeout 300s;
    client_header_timeout 300s;
    
    # ... rest of config ...
}
```

## Step 5: Test and Reload

```bash
# Test configuration
sudo nginx -t

# If test passes, reload (no downtime)
sudo systemctl reload nginx

# OR restart (brief downtime)
sudo systemctl restart nginx
```

## Step 6: Verify It's Applied

```bash
# Check active config again
sudo nginx -T | grep client_max_body_size

# Should now show: client_max_body_size 150M;
```

## Step 7: Check Nginx Error Logs

If still not working, check logs:

```bash
# View recent errors
sudo tail -50 /var/log/nginx/error.log

# Watch logs in real-time
sudo tail -f /var/log/nginx/error.log
```

## Common Issues

### Issue 1: Config in Wrong Block
The `client_max_body_size` must be in the `server` block, not `http` block (unless you want it global).

### Issue 2: Multiple Config Files
If you have multiple site configs, make sure you edited the one that's actually being used.

### Issue 3: Syntax Error
If there's a syntax error, nginx won't reload. Always run `sudo nginx -t` first.

### Issue 4: Config Not Saved
Make sure you saved the file in nano (Ctrl+O, Enter, Ctrl+X).

## Quick Diagnostic Commands

Run these to diagnose:

```bash
# 1. Check if setting exists in config file
sudo grep "client_max_body_size" /etc/nginx/sites-available/default

# 2. Check if it's in active config
sudo nginx -T | grep "client_max_body_size"

# 3. Check nginx status
sudo systemctl status nginx

# 4. Check which config files are enabled
ls -la /etc/nginx/sites-enabled/

# 5. Test config syntax
sudo nginx -t
```

## Expected Results After Fix

After properly configuring and reloading:

1. `sudo nginx -T | grep client_max_body_size` should show: `client_max_body_size 150M;`
2. Your upload should work (no more 413 error)
3. Test page should show the limit is now 150MB+

## If Still Not Working

1. **Check for multiple server blocks:**
   ```bash
   sudo nginx -T | grep -B 5 -A 15 "listen 80"
   ```
   Make sure `client_max_body_size` is in the correct server block.

2. **Check main nginx.conf:**
   ```bash
   sudo grep "client_max_body_size" /etc/nginx/nginx.conf
   ```
   If it's set to a low value here, it might override site configs.

3. **Check if there's a limit in http block:**
   ```bash
   sudo nginx -T | grep -B 10 -A 2 "client_max_body_size"
   ```
   This shows context around the setting.

4. **Restart nginx completely:**
   ```bash
   sudo systemctl stop nginx
   sudo systemctl start nginx
   ```




