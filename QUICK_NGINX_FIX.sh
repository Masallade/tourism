#!/bin/bash
# Quick script to verify and fix Nginx client_max_body_size

echo "=========================================="
echo "Nginx Upload Limit Diagnostic & Fix"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run with sudo: sudo bash QUICK_NGINX_FIX.sh"
    exit 1
fi

echo "1. Checking current Nginx configuration..."
echo "----------------------------------------"
NGINX_CHECK=$(nginx -T 2>/dev/null | grep "client_max_body_size" | head -1)
if [ -z "$NGINX_CHECK" ]; then
    echo "❌ client_max_body_size NOT FOUND in active config"
    echo ""
    echo "2. Checking config files..."
    CONFIG_FILE="/etc/nginx/sites-available/default"
    if grep -q "client_max_body_size" "$CONFIG_FILE"; then
        echo "⚠️  Found in config file but not active - need to reload nginx"
    else
        echo "❌ NOT FOUND in $CONFIG_FILE"
        echo ""
        echo "3. Adding client_max_body_size to config..."
        # Check if server block exists
        if grep -q "listen 80 default_server" "$CONFIG_FILE"; then
            # Add after listen directives
            sed -i '/listen \[::\]:80 default_server;/a\        client_max_body_size 150M;\n        client_body_timeout 300s;\n        client_header_timeout 300s;' "$CONFIG_FILE"
            echo "✅ Added client_max_body_size 150M to config file"
        else
            echo "❌ Could not find server block. Please edit manually."
            exit 1
        fi
    fi
else
    echo "✅ Found: $NGINX_CHECK"
    SIZE=$(echo "$NGINX_CHECK" | grep -oE '[0-9]+[MG]')
    if [ "$SIZE" = "150M" ] || [ "$SIZE" = "100M" ] || [ "$SIZE" = "200M" ]; then
        echo "✅ Size looks good: $SIZE"
    else
        echo "⚠️  Size might be too small: $SIZE"
    fi
fi

echo ""
echo "4. Testing Nginx configuration..."
echo "----------------------------------------"
if nginx -t; then
    echo "✅ Configuration is valid"
    echo ""
    echo "5. Reloading Nginx..."
    systemctl reload nginx
    if [ $? -eq 0 ]; then
        echo "✅ Nginx reloaded successfully"
    else
        echo "❌ Failed to reload nginx"
        exit 1
    fi
else
    echo "❌ Configuration has errors. Please fix them first."
    exit 1
fi

echo ""
echo "6. Verifying final configuration..."
echo "----------------------------------------"
FINAL_CHECK=$(nginx -T 2>/dev/null | grep "client_max_body_size" | head -1)
if [ -z "$FINAL_CHECK" ]; then
    echo "❌ Still not found after reload. Check nginx error logs."
else
    echo "✅ Final config: $FINAL_CHECK"
fi

echo ""
echo "=========================================="
echo "Done! Try uploading again."
echo "=========================================="














