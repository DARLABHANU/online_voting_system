#!/bin/bash

# Immediate Fix for "useAuth is not defined" Error
# This is a cache issue - the file is correct but browser is using old version

echo "🔧 Fixing cache issue..."

# Stop any running dev server first (Ctrl+C in the terminal where it's running)

# Remove Vite cache
echo "📦 Clearing Vite cache..."
rm -rf node_modules/.vite

# Remove dist folder if exists
echo "📦 Clearing dist folder..."
rm -rf dist

# Remove other possible cache directories
rm -rf .cache
rm -rf .turbo

echo "✅ Cache cleared!"
echo ""
echo "Now run: npm run dev"
echo ""
echo "Then in your browser:"
echo "1. Open DevTools (F12)"
echo "2. Right-click refresh button"
echo "3. Select 'Empty Cache and Hard Reload'"
echo ""
echo "Or use keyboard shortcut:"
echo "  - Windows/Linux: Ctrl+Shift+R"
echo "  - Mac: Cmd+Shift+R"
