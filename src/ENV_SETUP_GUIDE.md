# 🔧 Environment Setup Guide

## Frontend Environment Configuration

### Files Created

1. **`.env`** - Development environment (used by default)
2. **`.env.example`** - Template for team members
3. **`.env.production`** - Production environment
4. **`.gitignore`** - Prevents committing sensitive files

---

## 📝 Development Setup (.env)

Your `.env` file contains:

```bash
VITE_API_URL=http://localhost:5000
```

### ✅ This is correct for local development when:
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173` (Vite default)

---

## 🚀 How It Works

### In Your Components:
```typescript
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';
```

### Vite Requirements:
- ✅ Environment variables **MUST** be prefixed with `VITE_`
- ✅ They are replaced at **build time**, not runtime
- ✅ Access via `import.meta.env.VITE_VARIABLE_NAME`

---

## 🔄 Different Environments

### Development (Default)
```bash
# Uses .env
npm run dev
```

### Production Build
```bash
# Uses .env.production
npm run build
```

### Custom Environment
```bash
# Uses .env.staging (if you create it)
npm run build -- --mode staging
```

---

## 🌐 Production Deployment

### Step 1: Update `.env.production`
```bash
# Replace with your actual backend URL
VITE_API_URL=https://api.yourdomain.com
```

### Step 2: Build for Production
```bash
npm run build
```

### Step 3: Deploy `dist` folder
The built files will be in the `dist` folder with the production API URL baked in.

---

## 🔒 Security Notes

### ⚠️ IMPORTANT:
- `.env` is in `.gitignore` - **won't be committed to Git**
- `.env.example` is **committed** - safe template for others
- Never put secrets in frontend `.env` - they're **visible in browser**

### What's Safe to Put Here:
- ✅ Public API URLs
- ✅ Feature flags
- ✅ Public keys (like Stripe publishable key)

### What's NOT Safe:
- ❌ API secrets/tokens
- ❌ Database credentials
- ❌ Private keys
- ❌ Passwords

All sensitive data should be in **backend environment variables only**.

---

## 🧪 Testing Your Setup

### 1. Check if Vite reads the variable:
```typescript
console.log('API URL:', import.meta.env.VITE_API_URL);
// Should log: http://localhost:5000
```

### 2. Check Network Tab:
- Open browser DevTools → Network
- Perform an action (like login)
- Check if requests go to `http://localhost:5000`

### 3. If Variables Don't Work:
```bash
# Stop dev server (Ctrl+C)
# Restart it
npm run dev
```

**Note**: Vite requires restart after changing `.env` files!

---

## 📋 Quick Reference

| File | Purpose | Committed to Git? |
|------|---------|-------------------|
| `.env` | Development config | ❌ No |
| `.env.example` | Template for team | ✅ Yes |
| `.env.production` | Production config | ❌ No (or Yes, depends on team) |
| `.env.local` | Local overrides | ❌ No |

---

## 🔧 Common Issues

### Issue 1: "Cannot read VITE_API_URL"
**Solution**: 
- Check variable name starts with `VITE_`
- Restart dev server after changing `.env`

### Issue 2: "API calls fail"
**Solution**:
- Check backend is running on port 5000
- Check backend CORS includes `http://localhost:5173`
- Check `.env` has correct `VITE_API_URL`

### Issue 3: "Changes to .env not reflecting"
**Solution**:
```bash
# Stop server (Ctrl+C)
rm -rf node_modules/.vite
npm run dev
```

---

## ✅ Checklist

- [x] `.env` file created
- [x] `.env.example` file created
- [x] `.gitignore` includes `.env`
- [ ] Backend CORS updated to include `http://localhost:5173`
- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend dev server started with `npm run dev`

---

## 🎉 You're All Set!

Your environment is now properly configured. Start the dev server and everything should work!

```bash
npm run dev
```

Then open: http://localhost:5173
