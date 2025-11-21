# Fixing 413 Content Too Large Error

## Problem
When uploading service providers with large images/documents, you may encounter a `413 Content Too Large` error. This happens when the total request size exceeds server limits.

## Solution 1: Client-Side Compression (Already Implemented)
The application now automatically compresses images before upload. However, if files are still too large, you need to increase server limits.

## Solution 2: Increase Server Upload Limits

### For XAMPP (Windows/Mac/Linux)

1. **Find your PHP configuration file:**
   - Open XAMPP Control Panel
   - Click "Config" next to Apache
   - Select "PHP (php.ini)"

2. **Update these values in php.ini:**
   ```ini
   upload_max_filesize = 20M
   post_max_size = 25M
   max_file_uploads = 20
   max_execution_time = 300
   max_input_time = 300
   memory_limit = 256M
   ```

3. **Restart Apache** in XAMPP Control Panel

### For Production Server (Linux with Apache/Nginx)

#### Apache Configuration
Edit `/etc/php/8.2/apache2/php.ini` (adjust version as needed):
```ini
upload_max_filesize = 20M
post_max_size = 25M
max_file_uploads = 20
```

Also check Apache's `LimitRequestBody` in your virtual host:
```apache
<VirtualHost *:80>
    ...
    LimitRequestBody 26214400  # 25MB in bytes
    ...
</VirtualHost>
```

#### Nginx Configuration
Edit your Nginx site configuration:
```nginx
server {
    ...
    client_max_body_size 25M;
    ...
}
```

Then restart:
```bash
sudo systemctl restart nginx
sudo systemctl restart php8.2-fpm  # Adjust version
```

### For Laravel Application

You can also set these in `.env` file (if using Laravel Sail or custom PHP-FPM):
```env
PHP_UPLOAD_MAX_FILESIZE=20M
PHP_POST_MAX_SIZE=25M
```

## Verify Configuration

Create a test file `test_upload.php` in your public directory:

```php
<?php
echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "post_max_size: " . ini_get('post_max_size') . "\n";
echo "max_file_uploads: " . ini_get('max_file_uploads') . "\n";
echo "memory_limit: " . ini_get('memory_limit') . "\n";
?>
```

Visit `http://localhost/test_upload.php` to verify.

## Current Compression Settings

The application automatically compresses images:
- **Service Provider Images**: Max 1920×1080, 2MB
- **Service Images**: Max 1920×1080, 3MB
- **Documents (Images)**: Max 1920×1920, 2MB
- **PDFs**: Not compressed (kept as-is)

## Troubleshooting

1. **Still getting 413 error after compression?**
   - Check server logs: `storage/logs/laravel.log`
   - Verify PHP settings with `phpinfo()`
   - Try uploading smaller files first

2. **Images not compressing?**
   - Check browser console for errors
   - Verify JavaScript is enabled
   - Check that files are actually image files

3. **Server won't accept new limits?**
   - Some shared hosting has hard limits
   - Contact your hosting provider
   - Consider using cloud storage (S3) for large files

## Recommended Limits

For this application:
- `upload_max_filesize`: 10-20MB
- `post_max_size`: 15-25MB (should be larger than upload_max_filesize)
- `max_file_uploads`: 10-20 files

These limits allow for:
- Multiple service provider images
- Multiple documents
- Room for form data

