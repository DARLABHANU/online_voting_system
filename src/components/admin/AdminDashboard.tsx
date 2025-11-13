import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft, Users, Vote, Calendar, FileText } from 'lucide-react';
import PendingUsers from './PendingUsers';
import PendingCandidates from './PendingCandidates';
import ManageElections from './ManageElections';
import ManageCandidates from './ManageCandidates';

export default function AdminDashboard() {
  const location = useLocation();

  const navItems = [
    { path: '/admin/users', label: 'Pending Users', icon: Users },
    { path: '/admin/candidates', label: 'Pending Candidates', icon: Vote },
    { path: '/admin/elections', label: 'Manage Elections', icon: Calendar },
    { path: '/admin/manage-candidates', label: 'Manage Candidates', icon: FileText },
  ];

  return (
    <div className="min-h-screen">
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, candidates, and elections</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-2 sticky top-24">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className="w-full justify-start"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route index element={<PendingUsers />} />
              <Route path="users" element={<PendingUsers />} />
              <Route path="candidates" element={<PendingCandidates />} />
              <Route path="elections" element={<ManageElections />} />
              <Route path="manage-candidates" element={<ManageCandidates />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
