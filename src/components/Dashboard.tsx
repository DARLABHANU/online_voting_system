import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Vote, LogOut, UserCircle, Calendar, AlertTriangle, FileText, Settings } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

interface Election {
  _id: string;
  title: string;
  start: string;
  end: string;
  isActive: boolean;
  eligibility: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`);
      setElections(response.data.elections);
    } catch (error: any) {
      toast.error('Failed to load elections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const getElectionStatus = (election: Election) => {
    const now = new Date();
    const start = new Date(election.start);
    const end = new Date(election.end);

    if (now < start) return { label: 'Upcoming', color: 'bg-blue-500' };
    if (now > end) return { label: 'Ended', color: 'bg-gray-500' };
    return { label: 'Active', color: 'bg-green-500' };
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Vote className="h-8 w-8 text-blue-600" />
              <span className="text-xl">VoteSecure</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <UserCircle className="h-5 w-5" />
                <span>{user?.name}</span>
              </div>
              {user?.isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">
            Your eligibility: <Badge variant="outline">{user?.eligibility}</Badge>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link to="/nominate">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Vote className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg mb-1">Nominate Yourself</h3>
                  <p className="text-gray-600">Run as a candidate in an election</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/report">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg mb-1">Report an Issue</h3>
                  <p className="text-gray-600">Submit feedback or report problems</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Elections */}
        <div>
          <h2 className="text-2xl mb-4">Available Elections</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : elections.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl mb-2">No Elections Available</h3>
                <p className="text-gray-600">There are no active elections for your eligibility group at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {elections.map((election) => {
                const status = getElectionStatus(election);
                const now = new Date();
                const end = new Date(election.end);
                const canVote = now >= new Date(election.start) && now <= end && election.isActive;

                return (
                  <Card key={election._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl">{election.title}</h3>
                        <Badge className={status.color}>{status.label}</Badge>
                      </div>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Start: {new Date(election.start).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>End: {new Date(election.end).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Link to={`/election/${election._id}`}>
                        <Button className="w-full" variant={canVote ? 'default' : 'outline'}>
                          {canVote ? 'Vote Now' : 'View Details'}
                        </Button>
                      </Link>
                      {now > end && (
                        <Link to={`/results/${election._id}`}>
                          <Button className="w-full" variant="outline">
                            View Results
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}