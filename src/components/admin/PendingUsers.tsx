import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, Mail, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  eligibility: string;
  createdAt: string;
}

export default function PendingUsers() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/pending-users`);
      setUsers(response.data);
    } catch (error: any) {
      toast.error('Failed to load pending users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await axios.post(`${API_URL}/admin/approve/${userId}`);
      toast.success('User approved successfully');
      fetchPendingUsers();
    } catch (error: any) {
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await axios.post(`${API_URL}/admin/reject/${userId}`);
      toast.success('User rejected and removed');
      fetchPendingUsers();
    } catch (error: any) {
      toast.error('Failed to reject user');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl mb-2">No Pending Users</h3>
          <p className="text-gray-600">All user registrations have been processed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl mb-4">Pending User Approvals</h2>
      {users.map((user) => (
        <Card key={user._id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl mb-2">{user.name}</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <Badge variant="outline">{user.eligibility}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => handleApprove(user._id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => handleReject(user._id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}