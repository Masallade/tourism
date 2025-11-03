#!/bin/bash

# Script to replace all fetch() calls with window.apiClient in remaining components

echo "🔧 Fixing all remaining fetch() calls..."

# List of files to fix
files=(
    "resources/js/components/admin/ServiceProvidersList.jsx"
    "resources/js/components/admin/ServiceProviderForm.jsx"
    "resources/js/components/CountryDetail.jsx"
    "resources/js/components/ThemeDetail.jsx"
    "resources/js/components/ProvidersMap.jsx"
    "resources/js/components/AIAssistance.jsx"
    "resources/js/components/Trips.jsx"
    "resources/js/components/UserProfile.jsx"
    "resources/js/components/ServiceDetail.jsx"
)

echo "⚠️  Note: This script provides patterns. Manual review recommended for complex cases."
echo "📝 Files to update:"
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        fetch_count=$(grep -c "fetch(['\"]/api" "$file" 2>/dev/null || echo "0")
        if [ "$fetch_count" -gt 0 ]; then
            echo "  - $file ($fetch_count fetch calls)"
        fi
    fi
done

echo ""
echo "✅ Use search and replace in your IDE:"
echo "   Find: await fetch('/api/"
echo "   Replace: await window.apiClient.get('/api/"
echo ""
echo "   Find: fetch('/api/"
echo "   Replace: window.apiClient.get('/api/"
echo ""
echo "   Find: .json()"
echo "   Replace: .data (and use response.data instead)"




