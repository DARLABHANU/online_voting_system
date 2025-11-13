# Online Voting System - Frontend

A modern, secure, and feature-rich online voting platform built with React, TypeScript, and Tailwind CSS.

## Features

### User Features
- **Secure Authentication**: JWT-based login and registration system
- **User Approval System**: Admin approval required before voting access
- **Dashboard**: View all available elections filtered by eligibility
- **Vote Casting**: Secure one-vote-per-election mechanism
- **Results & Statistics**: View detailed results with charts after elections end
- **Self-Nomination**: Users can nominate themselves as candidates
- **Issue Reporting**: Submit feedback and report problems

### Admin Features
- **User Management**: Approve or reject pending user registrations
- **Candidate Management**: Approve nominations and manage candidates
- **Election Management**: Create, update, and delete elections
- **Full CRUD Operations**: Complete control over all system entities

### Security Features
- JWT token authentication
- Protected routes for authenticated users
- Admin-only routes with role-based access
- Rate limiting support (backend)
- Input validation and sanitization

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API requests
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **Lucide React** for icons

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- Backend server running (see backend code provided)
- MongoDB database configured

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend URL:
   ```
   VITE_API_URL=http://localhost:5000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Backend Configuration

Make sure your backend is configured with the following:

1. **CORS Settings**: Update the backend CORS configuration to allow your frontend domain:
   ```javascript
   app.use(cors({
     origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
     credentials: true
   }));
   ```

2. **Environment Variables**: Set up the following in your backend `.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key_here
   PORT=5000
   ```

3. **Start Backend Server**:
   ```bash
   npm start
   ```

## Usage

### For Voters

1. **Register**: Create an account with your details
2. **Wait for Approval**: Admin must approve your account
3. **Login**: Access your dashboard after approval
4. **Vote**: Browse elections and cast your vote
5. **View Results**: See results after elections end

### For Candidates

1. **Register**: Create an account as a voter
2. **Nominate**: Submit your candidacy for an election
3. **Wait for Approval**: Admin reviews your nomination
4. **Campaign**: Your profile will appear to voters

### For Administrators

1. **Login**: Use admin credentials
2. **Access Admin Panel**: Click "Admin Panel" in navigation
3. **Manage Users**: Approve/reject pending registrations
4. **Manage Candidates**: Review and approve nominations
5. **Manage Elections**: Create, update, and delete elections

## API Endpoints Used

- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /dashboard` - Fetch available elections
- `GET /election/:id/candidates` - Fetch candidates
- `POST /vote` - Cast a vote
- `GET /results/:id` - View election results
- `GET /stats/:id` - View election statistics
- `POST /nominate` - Submit candidate nomination
- `POST /report` - Submit issue report

### Admin Endpoints
- `GET /admin/pending-users` - Fetch pending users
- `POST /admin/approve/:id` - Approve user
- `POST /admin/reject/:id` - Reject user
- `GET /admin/pending-candidates` - Fetch pending candidates
- `POST /admin/approve-candidate/:id` - Approve candidate
- `POST /admin/reject-candidate/:id` - Reject candidate
- `POST /admin/elections` - Create election
- `GET /elections` - Fetch all elections
- `PUT /admin/elections/:id` - Update election
- `DELETE /admin/elections/:id` - Delete election
- `POST /admin/candidates` - Create candidate
- `GET /admin/candidates` - Fetch all candidates
- `PUT /admin/candidates/:id` - Update candidate
- `DELETE /admin/candidates/:id` - Delete candidate

## Design Features

- **Modern UI**: Clean, professional interface with gradient backgrounds
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Data Visualization**: Interactive charts for election results
- **Loading States**: Smooth loading indicators
- **Toast Notifications**: User-friendly feedback messages
- **Form Validation**: Client-side validation for better UX
- **Accessibility**: Semantic HTML and proper ARIA labels

## Security Considerations

⚠️ **Important Security Notes**:

1. This is a demonstration project. For production use:
   - Implement HTTPS
   - Use environment-specific configurations
   - Add additional rate limiting
   - Implement CSRF protection
   - Add more comprehensive input validation
   - Set up proper logging and monitoring
   - Never expose sensitive data in the frontend

2. The backend implements security best practices:
   - Password hashing with bcrypt
   - JWT token authentication
   - Rate limiting on login attempts
   - Input sanitization
   - MongoDB injection prevention

## Contributing

This project was built to match the provided backend API specifications. When making changes, ensure compatibility with the backend endpoints and data structures.

## License

This project is for educational and demonstration purposes.