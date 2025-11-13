import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import ElectionDetails from './components/ElectionDetails';
import Results from './components/Results';
import NominatePage from './components/NominatePage';
import ReportPage from './components/ReportPage';
import AdminDashboard from './components/admin/AdminDashboard';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/election/:id" element={
              <ProtectedRoute>
                <ElectionDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/results/:id" element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } />
            
            <Route path="/nominate" element={
              <ProtectedRoute>
                <NominatePage />
              </ProtectedRoute>
            } />
            
            <Route path="/report" element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}
