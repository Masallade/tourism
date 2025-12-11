<?php
// Test PHP Upload Limits
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>PHP Upload Limits Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        table { border-collapse: collapse; width: 100%; max-width: 600px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
    </style>
</head>
<body>
    <h1>PHP Upload Limits Check</h1>
    <p><strong>PHP Configuration File:</strong> <?php echo php_ini_loaded_file(); ?></p>
    
    <table>
        <tr>
            <th>Setting</th>
            <th>Current Value</th>
            <th>Status</th>
        </tr>
        <tr>
            <td>upload_max_filesize</td>
            <td><?php echo ini_get('upload_max_filesize'); ?></td>
            <td class="<?php echo (ini_get('upload_max_filesize') >= '100M') ? 'success' : 'error'; ?>">
                <?php echo (ini_get('upload_max_filesize') >= '100M') ? '✓ OK' : '✗ Too Low'; ?>
            </td>
        </tr>
        <tr>
            <td>post_max_size</td>
            <td><?php echo ini_get('post_max_size'); ?></td>
            <td class="<?php echo (ini_get('post_max_size') >= '120M') ? 'success' : 'error'; ?>">
                <?php echo (ini_get('post_max_size') >= '120M') ? '✓ OK' : '✗ Too Low'; ?>
            </td>
        </tr>
        <tr>
            <td>max_file_uploads</td>
            <td><?php echo ini_get('max_file_uploads'); ?></td>
            <td class="<?php echo (ini_get('max_file_uploads') >= 20) ? 'success' : 'error'; ?>">
                <?php echo (ini_get('max_file_uploads') >= 20) ? '✓ OK' : '✗ Too Low'; ?>
            </td>
        </tr>
        <tr>
            <td>max_execution_time</td>
            <td><?php echo ini_get('max_execution_time'); ?> seconds</td>
            <td class="<?php echo (ini_get('max_execution_time') >= 300) ? 'success' : 'error'; ?>">
                <?php echo (ini_get('max_execution_time') >= 300) ? '✓ OK' : '✗ Too Low'; ?>
            </td>
        </tr>
        <tr>
            <td>memory_limit</td>
            <td><?php echo ini_get('memory_limit'); ?></td>
            <td class="<?php echo (ini_get('memory_limit') >= '256M') ? 'success' : 'error'; ?>">
                <?php echo (ini_get('memory_limit') >= '256M') ? '✓ OK' : '✗ Too Low'; ?>
            </td>
        </tr>
    </table>
    
    <h2>Raw Values (in bytes)</h2>
    <ul>
        <li><strong>post_max_size (bytes):</strong> <?php echo ini_get('post_max_size') ? (int)ini_get('post_max_size') * 1024 * 1024 : 'Not set'; ?></li>
        <li><strong>Current limit causing error:</strong> 8388608 bytes (8MB)</li>
        <li><strong>Your upload size:</strong> ~9693970 bytes (~9.69MB)</li>
    </ul>
    
    <h2>Troubleshooting</h2>
    <p>If values are still showing 8M:</p>
    <ol>
        <li><strong>Restart Apache</strong> in XAMPP Control Panel (Stop → Wait 3 seconds → Start)</li>
        <li><strong>Check which php.ini is loaded:</strong> See path above</li>
        <li><strong>Verify you edited the correct file:</strong> Should be <code>/Applications/XAMPP/xamppfiles/etc/php.ini</code></li>
        <li><strong>Check for Apache LimitRequestBody:</strong> May need to check httpd.conf</li>
    </ol>
    
    <h2>Next Steps</h2>
    <p>If post_max_size is still 8M after restart:</p>
    <ol>
        <li>Make sure you edited the php.ini file shown above</li>
        <li>Check that the values don't have semicolons (;) in front (they should be uncommented)</li>
        <li>Restart Apache completely</li>
        <li>Clear browser cache and refresh this page</li>
    </ol>
</body>
</html>
















