# 🚀 Online Voting System - Complete Setup Checklist

## ✅ Issues Fixed

### 1. **Dashboard.tsx - Missing Imports** ✅ FIXED
- **Problem**: Missing React hooks and router imports
- **Solution**: Added all required imports:
  - `useState`, `useEffect` from 'react'
  - `Link`, `useNavigate` from 'react-router-dom'
  - `useAuth` from '../context/AuthContext'
  - `axios`

### 2. **Environment Configuration** ✅ FIXED
- Created `.env` file with correct API URL
- Backend runs on port **5000**
- Frontend (Vite) runs on port **5173**

### 3. **CORS Configuration** ⚠️ NEEDS BACKEND UPDATE
- **Current Backend**: Allows only `http://localhost:3000`
- **Frontend Port**: Runs on `http://localhost:5173` (Vite default)
- **Action Required**: Update backend CORS (see instructions below)

---

## 🔧 Backend CORS Fix Required

### Current Backend Code (Line 13-16):
```javascript
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
```

### ✅ Update to This:
```javascript
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"], // Support both Vite and CRA
  credentials: true
}));
```

### Or for Development Only:
```javascript
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
```

---

## 📋 Complete Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` File**
   ```bash
   MONGO_URI=mongodb://localhost:27017/online_voting
   JWT_SECRET=your_super_secure_secret_key_here_min_32_chars
   PORT=5000
   NODE_ENV=development
   ```

3. **Update CORS Configuration**
   - Open your backend `index.js` or `server.js`
   - Change line 13-16 as shown above

4. **Start MongoDB**
   ```bash
   # macOS/Linux
   sudo systemctl start mongodb
   
   # Windows
   net start MongoDB
   
   # Or using Docker
   docker run -d -p 27017:27017 mongo
   ```

5. **Start Backend Server**
   ```bash
   npm start
   # Should show: ✅ Server running on port 5000
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Verify `.env` File Exists**
   ```bash
   cat .env
   # Should show: VITE_API_URL=http://localhost:5000
   ```

3. **Start Frontend Server**
   ```bash
   npm run dev
   # Should open on http://localhost:5173
   ```

---

## 🧪 Testing the Application

### 1. Create First Admin User (Via MongoDB)

```javascript
// Connect to MongoDB
use online_voting

// Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIE.yvlkCe", // "password123"
  isAdmin: true,
  approved: true,
  eligibility: "general",
  createdAt: new Date()
})
```

**Login Credentials:**
- Email: `admin@example.com`
- Password: `password123`

### 2. Test User Registration
1. Go to http://localhost:5173
2. Click "Register"
3. Fill in the form:
   - Name: Test Voter
   - Email: voter@example.com
   - Password: password123 (min 8 chars)
   - Eligibility: General
4. Should show: "Awaiting admin approval"

### 3. Approve User (As Admin)
1. Login with admin credentials
2. Click "Admin Panel"
3. Go to "Pending Users"
4. Click "Approve" on the new user

### 4. Test Voting Flow
1. **Create Election** (Admin Panel → Manage Elections)
   - Title: "2024 General Election"
   - Start: Today
   - End: Tomorrow
   - Eligibility: General

2. **Add Candidates** (Admin Panel → Manage Candidates)
   - Name: "Candidate A"
   - Party: "Democratic Party"
   - Election: Select created election
   
3. **Vote** (Login as voter)
   - Dashboard shows election
   - Click "Vote Now"
   - Select candidate
   - Confirm vote

4. **View Results** (After election ends or as admin)
   - Click "View Results"
   - See vote counts and charts

---

## 🔍 Backend-Frontend Compatibility Check

### ✅ All 23 Endpoints Verified

| Endpoint | Method | Frontend File | Status |
|----------|--------|---------------|--------|
| `/register` | POST | RegisterPage.tsx | ✅ |
| `/login` | POST | LoginPage.tsx | ✅ |
| `/dashboard` | GET | Dashboard.tsx | ✅ |
| `/election/:id/candidates` | GET | ElectionDetails.tsx | ✅ |
| `/vote` | POST | ElectionDetails.tsx | ✅ |
| `/results/:electionId` | GET | Results.tsx | ✅ |
| `/stats/:electionId` | GET | Results.tsx | ✅ |
| `/nominate` | POST | NominatePage.tsx | ✅ |
| `/report` | POST | ReportPage.tsx | ✅ |
| `/elections` | GET | ManageElections.tsx | ✅ |
| `/admin/pending-users` | GET | PendingUsers.tsx | ✅ |
| `/admin/approve/:id` | POST | PendingUsers.tsx | ✅ |
| `/admin/reject/:id` | POST | PendingUsers.tsx | ✅ |
| `/admin/pending-candidates` | GET | PendingCandidates.tsx | ✅ |
| `/admin/approve-candidate/:id` | POST | PendingCandidates.tsx | ✅ |
| `/admin/reject-candidate/:id` | POST | PendingCandidates.tsx | ✅ |
| `/admin/elections` | POST | ManageElections.tsx | ✅ |
| `/admin/elections/:id` | PUT | ManageElections.tsx | ✅ |
| `/admin/elections/:id` | DELETE | ManageElections.tsx | ✅ |
| `/admin/candidates` | GET | ManageCandidates.tsx | ✅ |
| `/admin/candidates` | POST | ManageCandidates.tsx | ✅ |
| `/admin/candidates/:id` | PUT | ManageCandidates.tsx | ✅ |
| `/admin/candidates/:id` | DELETE | ManageCandidates.tsx | ✅ |

---

## 🐛 Common Issues & Solutions

### Issue 1: "CORS Error"
**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**: Update backend CORS configuration (see above)

---

### Issue 2: "No token provided"
**Error**: 401 Unauthorized

**Solution**: 
1. Make sure you're logged in
2. Check localStorage has token: `localStorage.getItem('token')`
3. Verify token is sent: Check Network tab → Request Headers

---

### Issue 3: "Account not approved yet"
**Error**: After login

**Solution**: Admin must approve user first
1. Login as admin
2. Admin Panel → Pending Users → Approve

---

### Issue 4: "Failed to load elections"
**Error**: Dashboard shows error

**Possible Causes**:
1. Backend not running (check http://localhost:5000/health)
2. CORS issue (check browser console)
3. Not logged in (check localStorage token)
4. User not approved (admin must approve)

---

## 📊 Data Flow Verification

### Registration Flow
```
User → RegisterPage → POST /register → MongoDB
     ↓
Admin → PendingUsers → POST /admin/approve/:id → User.approved = true
     ↓
User → LoginPage → POST /login → JWT Token + User Data
```

### Voting Flow
```
User → Dashboard → GET /dashboard → Elections (filtered by eligibility)
     ↓
Click Election → ElectionDetails → GET /election/:id/candidates
     ↓
Select Candidate → POST /vote → Vote saved (one per election)
     ↓
After election ends → Results → GET /results/:electionId
```

### Admin Flow
```
Admin → AdminDashboard → Multiple routes:
   ├─ GET /admin/pending-users → Approve/Reject
   ├─ GET /admin/pending-candidates → Approve/Reject
   ├─ POST /admin/elections → Create
   ├─ PUT /admin/elections/:id → Update
   └─ DELETE /admin/elections/:id → Delete (cascades to candidates & votes)
```

---

## ✅ Final Verification

### Backend Health Check
```bash
curl http://localhost:5000/health
# Should return: {"status":"OK","timestamp":"...","uptime":...}
```

### Frontend Running
```bash
# Browser should show at http://localhost:5173
# No console errors
# Landing page loads correctly
```

### Database Connection
```bash
# MongoDB should show:
✅ Connected to MongoDB
```

---

## 🎉 Success Criteria

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] MongoDB is connected
- [ ] No CORS errors in browser console
- [ ] Can register new user
- [ ] Admin can approve users
- [ ] Can login successfully
- [ ] Dashboard shows elections
- [ ] Can cast vote
- [ ] Can view results
- [ ] All admin functions work

---

## 📝 Notes

- **Port 5000**: Backend API
- **Port 5173**: Frontend (Vite)
- **Port 27017**: MongoDB
- **JWT Expiry**: 7 days
- **Rate Limit**: 20 login attempts per 15 minutes
- **Password Min**: 8 characters
- **Vote Limit**: 1 per election per user

---

## 🔐 Security Reminders

⚠️ **For Production**:
1. Change JWT_SECRET to strong random string
2. Set specific CORS origins
3. Enable HTTPS
4. Use environment variables for all secrets
5. Implement additional rate limiting
6. Add request logging
7. Enable MongoDB authentication
8. Use secure session storage
9. Implement CSRF protection
10. Regular security audits
