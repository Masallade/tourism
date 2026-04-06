#!/bin/bash

# Script to replace all fetch() calls with window.apiClient calls
# This will fix the production build issue

echo "🔧 Starting comprehensive fetch() to apiClient replacement..."

# List of files to update
files=(
    "resources/js/components/UserProfile.jsx"
    "resources/js/components/admin/ServiceProvidersList.jsx"
    "resources/js/components/admin/ServiceProviderForm.jsx"
    "resources/js/components/CountryDetail.jsx"
    "resources/js/components/ThemeDetail.jsx"
    "resources/js/components/ProvidersMap.jsx"
    "resources/js/components/AIAssistance.jsx"
    "resources/js/components/Trips.jsx"
    "resources/js/components/ServiceProviderDashboard.jsx"
    "resources/js/components/ServiceProviderLogin.jsx"
    "resources/js/components/admin/ThemesList.jsx"
    "resources/js/components/admin/ThemeForm.jsx"
    "resources/js/components/admin/CountryForm.jsx"
    "resources/js/components/ServiceDetail.jsx"
)

# Function to replace fetch patterns
replace_fetch() {
    local file="$1"
    echo "📝 Updating $file..."
    
    # Replace simple GET requests
    sed -i '' 's/await fetch('\''\/api\/\([^'\'']*\)'\'')/await window.apiClient.get('\''\/api\/\1'\'')/g' "$file"
    
    # Replace fetch with .json() pattern
    sed -i '' 's/const response = await fetch('\''\/api\/\([^'\'']*\)'\'');/const response = await window.apiClient.get('\''\/api\/\1'\'');/g' "$file"
    sed -i '' 's/const data = await response\.json();/const data = response.data;/g' "$file"
    
    # Replace POST requests
    sed -i '' 's/await fetch('\''\/api\/\([^'\'']*\)'\'', {/await window.apiClient.post('\''\/api\/\1'\'', /g' "$file"
    
    # Replace PUT requests
    sed -i '' 's/method: '\''PUT'\'',/method: '\''PUT'\'',/g' "$file"
    
    # Replace DELETE requests
    sed -i '' 's/method: '\''DELETE'\'',/method: '\''DELETE'\'',/g' "$file"
    
    # Replace PATCH requests
    sed -i '' 's/method: '\''PATCH'\'',/method: '\''PATCH'\'',/g' "$file"
    
    echo "✅ Updated $file"
}

# Update each file
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        replace_fetch "$file"
    else
        echo "⚠️  File not found: $file"
    fi
done

echo "🎉 All files updated! Now testing the build..."






