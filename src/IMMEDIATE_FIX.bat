@echo off
REM Immediate Fix for "useAuth is not defined" Error
REM This is a cache issue - the file is correct but browser is using old version

echo 🔧 Fixing cache issue...

REM Stop any running dev server first (Ctrl+C in the terminal where it's running)

REM Remove Vite cache
echo 📦 Clearing Vite cache...
rmdir /s /q node_modules\.vite 2>nul

REM Remove dist folder if exists
echo 📦 Clearing dist folder...
rmdir /s /q dist 2>nul

REM Remove other possible cache directories
rmdir /s /q .cache 2>nul
rmdir /s /q .turbo 2>nul

echo ✅ Cache cleared!
echo.
echo Now run: npm run dev
echo.
echo Then in your browser:
echo 1. Open DevTools (F12)
echo 2. Right-click refresh button
echo 3. Select 'Empty Cache and Hard Reload'
echo.
echo Or use keyboard shortcut: Ctrl+Shift+R
pause
