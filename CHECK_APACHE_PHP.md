# Fix: PHP Settings Not Applied

## Problem Found
The CLI PHP is using a different php.ini file than XAMPP Apache:
- **CLI PHP**: `/usr/local/etc/php/8.3/php.ini` (still shows 8M)
- **XAMPP Apache PHP**: `/Applications/XAMPP/xamppfiles/etc/php.ini` (you edited this)

## Solution Steps

### Step 1: Verify Which php.ini Apache Uses

1. Visit: `http://127.0.0.1:8001/test_php_limits.php`
2. Check the "PHP Configuration File" path shown
3. Make sure it shows: `/Applications/XAMPP/xamppfiles/etc/php.ini`

### Step 2: If Apache Uses Different php.ini

If the test file shows a different path, you need to edit THAT file instead.

### Step 3: Check Apache httpd.conf for LimitRequestBody

Apache might have a `LimitRequestBody` directive that overrides PHP settings.

1. Open XAMPP Control Panel
2. Click "Config" next to Apache
3. Select "httpd.conf"
4. Search for `LimitRequestBody` (Ctrl+F / Cmd+F)
5. If found, either:
   - Comment it out: `#LimitRequestBody 8388608`
   - Or increase it: `LimitRequestBody 134217728` (128MB in bytes)

### Step 4: Restart Apache Properly

1. In XAMPP Control Panel, click **"Stop"** for Apache
2. **Wait 5-10 seconds** (important!)
3. Click **"Start"** for Apache
4. Wait until Apache shows "Running" in green

### Step 5: Verify Again

1. Visit: `http://127.0.0.1:8001/test_php_limits.php`
2. Check if `post_max_size` shows 512M (or at least 120M)
3. If still 8M, continue to Step 6

### Step 6: Check for Multiple php.ini Files

XAMPP might have multiple php.ini files. Check these locations:

```bash
# Check all php.ini files
find /Applications/XAMPP -name "php.ini" -type f
```

Edit ALL php.ini files found in XAMPP directory.

### Step 7: Alternative - Use .htaccess (if php.ini doesn't work)

The `.htaccess` file in `public/` already has PHP settings. Make sure Apache allows `.htaccess` overrides:

1. Open `httpd.conf` in XAMPP
2. Find: `<Directory "/Applications/XAMPP/xamppfiles/htdocs">`
3. Make sure it has: `AllowOverride All`
4. Restart Apache

### Step 8: Last Resort - Check Apache Error Logs

1. In XAMPP Control Panel, click "Logs" next to Apache
2. Select "error_log"
3. Look for PHP configuration errors
4. Fix any errors shown

## Quick Test Command

After restarting Apache, run this in terminal to check Apache's PHP:

```bash
curl -s http://127.0.0.1:8001/test_php_limits.php | grep "post_max_size"
```

This will show what Apache PHP sees, not CLI PHP.

## Expected Result

After fixing, `test_php_limits.php` should show:
- ✅ post_max_size: 512M (or at least 120M)
- ✅ upload_max_filesize: 512M (or at least 100M)

Then your 9.69MB upload will work!
















