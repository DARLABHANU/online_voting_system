# 🚀 Quick Start Guide - Online Voting System

## ⚡ 3-Step Setup

### 1️⃣ Fix Backend CORS (Required!)

Open your backend file and change line 13-16:

**FROM:**
```javascript
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
```

**TO:**
```javascript
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
```

### 2️⃣ Start Backend
```bash
# Make sure MongoDB is running
npm start
# Should show: ✅ Server running on port 5000
```

### 3️⃣ Start Frontend
```bash
npm run dev
# Opens at http://localhost:5173
```

---

## 🎉 That's It!

Your application should now be running successfully!

---

## 🧪 Quick Test

1. **Register a user**: http://localhost:5173/register
2. **Create admin in MongoDB**:
   ```javascript
   db.users.insertOne({
     name: "Admin",
     email: "admin@test.com",
     password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIE.yvlkCe",
     isAdmin: true,
     approved: true,
     eligibility: "general",
     createdAt: new Date()
   })
   ```
   Login: admin@test.com / password123

3. **Approve your user** (as admin)
4. **Create an election** (Admin Panel)
5. **Add candidates** (Admin Panel)
6. **Vote!** (as user)

---

## 📚 More Information

- **Full Setup**: See `SETUP_CHECKLIST.md`
- **Backend Match**: See `VERIFICATION_REPORT.md`
- **CORS Details**: See `BACKEND_CORS_FIX.md`

---

## ❓ Troubleshooting

**CORS Error?** → Update backend CORS (Step 1)

**Can't login?** → User must be approved by admin

**No elections showing?** → Check eligibility matches user's eligibility

**Vote button disabled?** → Either already voted or election not active
