# Final Fix: Apache Not Using Updated php.ini

## Problem Summary

✅ **File has correct values**: `/usr/local/etc/php/8.3/php.ini` shows:
- `post_max_size = 512M` ✓
- `upload_max_filesize = 512M` ✓
- `memory_limit = 128M` (needs update to 512M)

❌ **Apache still sees old values**:
- `post_max_size = 8M` ✗
- `upload_max_filesize = 2M` ✗

## Root Cause

Apache is using a **different PHP installation** or hasn't reloaded the configuration. The test page shows Apache is loading `/usr/local/etc/php/8.3/php.ini`, but it's reading old cached values.

## Solution Steps

### Step 1: Update memory_limit

The file shows `memory_limit = 128M` but should be `512M`:

1. Open `/usr/local/etc/php/8.3/php.ini`
2. Find line 443: `memory_limit = 128M`
3. Change to: `memory_limit = 512M`
4. Save the file

### Step 2: Force Apache to Reload PHP Configuration

**Option A: Full Apache Restart (Recommended)**
1. XAMPP Control Panel → **Stop** Apache
2. Wait **10 seconds** (important for full cleanup)
3. **Start** Apache
4. Wait until "Running" shows in green

**Option B: If Option A Doesn't Work - Kill Apache Process**
```bash
# Find Apache process
ps aux | grep httpd

# Kill it (replace PID with actual process ID)
kill -9 <PID>

# Then restart from XAMPP Control Panel
```

### Step 3: Check Apache PHP Module

Apache might be using a different PHP module. Check:

1. Open XAMPP Control Panel
2. Click "Config" → "httpd.conf"
3. Search for `LoadModule php` or `php_module`
4. Note which PHP module is loaded

### Step 4: Verify Changes

1. Visit: `http://127.0.0.1:8001/test_php_limits.php`
2. Refresh the page (Ctrl+F5 / Cmd+Shift+R to clear cache)
3. Check if values now show 512M

### Step 5: If Still Not Working - Check Apache Error Logs

1. XAMPP Control Panel → "Logs" → "error_log"
2. Look for PHP configuration errors
3. Check if there are warnings about php.ini

### Step 6: Alternative - Check for PHP-FPM

If you're using PHP-FPM instead of mod_php:

1. Check if PHP-FPM is running: `ps aux | grep php-fpm`
2. If running, restart it: `sudo brew services restart php` (if using Homebrew)
3. Or restart from XAMPP Control Panel

### Step 7: Last Resort - Use .htaccess Override

The `.htaccess` file already has PHP settings. Make sure Apache allows overrides:

1. Open `httpd.conf` in XAMPP
2. Find: `<Directory "/Applications/XAMPP/xamppfiles/htdocs">`
3. Ensure: `AllowOverride All`
4. Restart Apache

## Quick Verification Commands

After restarting, verify in terminal:

```bash
# Check what Apache PHP sees (via curl)
curl -s http://127.0.0.1:8001/test_php_limits.php | grep "post_max_size"

# Should show: post_max_size: 512M
```

## Expected Result

After fixing, the test page should show:
- ✅ `post_max_size`: 512M
- ✅ `upload_max_filesize`: 512M  
- ✅ `memory_limit`: 512M
- ✅ `max_execution_time`: 300 seconds

Then your 9.69MB upload will work! 🎉


















