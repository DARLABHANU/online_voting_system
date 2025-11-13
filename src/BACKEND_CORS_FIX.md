# ⚠️ IMPORTANT: Backend CORS Configuration

## Current Issue

Your backend has CORS configured for:
```javascript
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
```

But Vite (your frontend) runs on **port 5173** by default, not 3000.

## Solution

Update your backend CORS configuration to:

```javascript
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"], // Allow both Vite and React ports
  credentials: true
}));
```

Or for development, you can use:

```javascript
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
```

## Production Configuration

For production, set specific domains:

```javascript
app.use(cors({
  origin: [
    "https://your-frontend-domain.com",
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
```

## Quick Fix

Add this to your backend code (replace the existing CORS setup):

```javascript
const allowedOrigins = [
  'http://localhost:5173', // Vite
  'http://localhost:3000', // Create React App
  'http://localhost:5174', // Vite alternative port
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```
