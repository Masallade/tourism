# Fix Upload Size Limit Error

## Problem
Error: `POST Content-Length of 9693652 bytes exceeds the limit of 8388608 bytes`

The server limit is 8MB, but you're trying to upload ~9.69MB.

## Solution: Update XAMPP php.ini

### Step 1: Open php.ini in XAMPP

**Option A: Via XAMPP Control Panel**
1. Open XAMPP Control Panel
2. Click "Config" button next to Apache
3. Select "PHP (php.ini)" - this opens the file

**Option B: Manual Path**
- macOS: `/Applications/XAMPP/xamppfiles/etc/php.ini`
- Windows: `C:\xampp\php\php.ini`
- Linux: `/opt/lampp/etc/php.ini`

### Step 2: Find and Update These Values

Search for these lines (use Ctrl+F / Cmd+F):

```ini
upload_max_filesize = 8M
post_max_size = 8M
```

Change them to:

```ini
upload_max_filesize = 100M
post_max_size = 120M
```

Also update these related settings:

```ini
max_file_uploads = 20
max_execution_time = 300
max_input_time = 300
memory_limit = 256M
```

### Step 3: Restart Apache

1. In XAMPP Control Panel, click "Stop" for Apache
2. Wait 2-3 seconds
3. Click "Start" for Apache

### Step 4: Verify Changes

Create a test file `test_limits.php` in your project root:

```php
<?php
echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "<br>";
echo "post_max_size: " . ini_get('post_max_size') . "<br>";
echo "max_file_uploads: " . ini_get('max_file_uploads') . "<br>";
echo "memory_limit: " . ini_get('memory_limit') . "<br>";
?>
```

Visit: `http://127.0.0.1:8001/test_limits.php`

You should see:
- `upload_max_filesize: 100M`
- `post_max_size: 120M`

## Why These Values?

- **upload_max_filesize = 100M**: Each file can be up to 100MB (you need 10MB per document)
- **post_max_size = 120M**: Total POST request can be 120MB (allows 7 documents × 10MB + image + form data)
- **max_file_uploads = 20**: Allows uploading multiple files at once

## If .htaccess Doesn't Work

XAMPP sometimes ignores `.htaccess` PHP settings. You **must** update `php.ini` directly.

## After Fixing

Your application now supports:
- ✅ Up to 7 documents
- ✅ Each document up to 10MB
- ✅ Total upload size up to 65MB (with buffer)

Try uploading your service provider again!





















