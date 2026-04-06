# XAMPP PHP Configuration Setup

## Issue
The `.htaccess` file may not work for setting PHP values in XAMPP. You need to update `php.ini` directly.

## Solution: Update php.ini in XAMPP

### Step 1: Find your php.ini file
1. Open XAMPP Control Panel
2. Click "Config" next to Apache
3. Select "PHP (php.ini)" - this will open the php.ini file

**OR** manually navigate to:
- Windows: `C:\xampp\php\php.ini`
- macOS: `/Applications/XAMPP/xamppfiles/etc/php.ini`
- Linux: `/opt/lampp/etc/php.ini`

### Step 2: Update these values in php.ini

Find and update these lines (search for them using Ctrl+F / Cmd+F):

```ini
; Maximum allowed size for uploaded files
upload_max_filesize = 100M

; Maximum size of POST data that PHP will accept
post_max_size = 120M

; Maximum number of files that can be uploaded simultaneously
max_file_uploads = 20

; Maximum execution time
max_execution_time = 300

; Maximum input time
max_input_time = 300

; Memory limit
memory_limit = 256M
```

### Step 3: Restart Apache
1. In XAMPP Control Panel, click "Stop" for Apache
2. Wait a few seconds
3. Click "Start" for Apache

### Step 4: Verify the changes

Run this command in terminal:
```bash
php -i | grep -E "post_max_size|upload_max_filesize"
```

You should see:
```
post_max_size => 120M => 120M
upload_max_filesize => 100M => 100M
```

## Alternative: Quick Test

If you can't edit php.ini, create a test file `test_php_limits.php` in your project root:

```php
<?php
phpinfo();
```

Then visit `http://127.0.0.1:8000/test_php_limits.php` and search for:
- `upload_max_filesize`
- `post_max_size`

Check if they show the updated values.

## Current Limits After Fix

- **Per file**: 30 MB (backend validation)
- **Total upload**: 120 MB (post_max_size)
- **Maximum files**: 7 documents + 1 image

## Troubleshooting

If changes don't take effect:
1. Make sure you edited the correct php.ini (the one Apache uses)
2. Restart Apache completely
3. Clear browser cache
4. Check Apache error logs for PHP configuration errors
























