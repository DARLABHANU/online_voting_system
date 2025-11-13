# 🔧 Fix: useAuth is not defined - Cache Issue

## Problem
The error shows your app is running on `http://localhost:3000` with stale cached files.
The import is correctly in the file, but the browser is using an old cached version.

## Solution: Clear Cache & Restart

### Option 1: Quick Fix (Recommended)
```bash
# Stop the dev server (Ctrl+C)

# Clear Vite cache
rm -rf node_modules/.vite

# Clear dist/build folder if exists
rm -rf dist

# Restart dev server
npm run dev
```

### Option 2: Hard Refresh Browser
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### Option 3: Complete Clean
```bash
# Stop dev server

# Remove all caches
rm -rf node_modules/.vite
rm -rf dist
rm -rf .cache

# Clear browser storage
# In DevTools → Application → Clear Storage → Clear all

# Restart
npm run dev
```

## Verification

After clearing cache, verify:
1. URL should be `http://localhost:5173` (Vite default)
2. No error in console about `useAuth`
3. Dashboard loads correctly

## If Still Not Working

Check the actual file being served:
1. Open DevTools → Sources
2. Find `Dashboard.tsx`
3. Check if line 3 has: `import { useAuth } from '../context/AuthContext';`

If the import is missing in browser but present in file → Cache issue confirmed
