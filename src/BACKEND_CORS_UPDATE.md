# 🔧 Backend CORS Update Required

## ⚠️ Action Required

Your backend needs a **one-line change** to work with the frontend.

---

## 📝 What to Change

**File**: Your backend `index.js` or `server.js` (wherever you have the Express app)

**Line**: Around line 13-16 (the `cors()` configuration)

### Current Code:
```javascript
app.use(cors({
  origin: ["http://localhost:3000"], // ❌ Wrong port for Vite
  credentials: true
}));
```

### Updated Code:
```javascript
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"], // ✅ Added Vite port
  credentials: true
}));
```

---

## 🔍 Why This Change?

- **Vite** (your frontend) runs on port **5173** by default
- **Create React App** runs on port 3000
- Your backend currently only allows requests from port 3000
- Adding 5173 allows your frontend to communicate with the backend

---

## ⚡ Quick Copy-Paste

```javascript
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
```

---

## 🧪 How to Verify It Works

1. **Update the CORS line** in your backend
2. **Restart your backend**:
   ```bash
   # Stop backend (Ctrl+C)
   npm start
   ```
3. **Start your frontend**:
   ```bash
   npm run dev
   ```
4. **Open browser**: http://localhost:5173
5. **Try to login** - it should work!

---

## ❓ What if I See CORS Errors?

If you see errors like:
- "Access to XMLHttpRequest has been blocked by CORS policy"
- "No 'Access-Control-Allow-Origin' header"

**Solution**: Make sure you:
1. ✅ Updated the CORS config
2. ✅ Restarted the backend server
3. ✅ Hard refreshed the browser (Ctrl+Shift+R)

---

## 🎯 That's It!

This is the **only change needed** in your backend. Everything else is already perfect!
