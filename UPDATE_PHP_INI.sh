#!/bin/bash
# Script to help update XAMPP php.ini file
# Run this script to find and update php.ini

echo "XAMPP PHP Configuration Updater"
echo "================================"
echo ""

# Find php.ini location
PHP_INI=$(php --ini | grep "Loaded Configuration File" | awk '{print $4}')

if [ -z "$PHP_INI" ] || [ ! -f "$PHP_INI" ]; then
    # Try common XAMPP locations
    if [ -f "/Applications/XAMPP/xamppfiles/etc/php.ini" ]; then
        PHP_INI="/Applications/XAMPP/xamppfiles/etc/php.ini"
    elif [ -f "/opt/lampp/etc/php.ini" ]; then
        PHP_INI="/opt/lampp/etc/php.ini"
    else
        echo "ERROR: Could not find php.ini file"
        echo "Please manually edit php.ini in XAMPP"
        exit 1
    fi
fi

echo "Found php.ini at: $PHP_INI"
echo ""
echo "Current values:"
grep -E "^(upload_max_filesize|post_max_size|max_file_uploads|max_execution_time|max_input_time|memory_limit)" "$PHP_INI" | grep -v "^;" | head -10

echo ""
echo "To update, edit this file and change:"
echo "  upload_max_filesize = 100M"
echo "  post_max_size = 120M"
echo "  max_file_uploads = 20"
echo "  max_execution_time = 300"
echo "  max_input_time = 300"
echo "  memory_limit = 256M"
echo ""
echo "Then restart Apache in XAMPP Control Panel"
