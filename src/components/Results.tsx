import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ArrowLeft, Trophy, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

interface CandidateResult {
  _id: string;
  name: string;
  party: string;
  manifesto?: string;
  photo?: string;
  votes: number;
  percentage: number;
}

interface Stats {
  totalVotes: number;
  eligibleVoters: number;
  turnout: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Results() {
  const { id } = useParams();
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResults();
    fetchStats();
  }, [id]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API_URL}/results/${id}`);
      setResults(response.data.results);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load results');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats/${id}`);
      setStats(response.data);
    } catch (error: any) {
      console.error('Failed to load stats');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const chartData = results.map((r) => ({
    name: r.name,
    votes: r.votes,
    percentage: r.percentage,
  }));

  const pieData = results.map((r) => ({
    name: r.name,
    value: r.votes,
  }));

  return (
    <div className="min-h-screen pb-12">
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
          <h1 className="text-3xl mb-2">Election Results</h1>
          <p className="text-gray-600">Final vote count and statistics</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">Total Votes</p>
                    <p className="text-2xl">{stats.totalVotes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">Eligible Voters</p>
                    <p className="text-2xl">{stats.eligibleVoters}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">Voter Turnout</p>
                    <p className="text-2xl">{stats.turnout}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Winner Card */}
        {results.length > 0 && (
          <Card className="mb-8 border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Trophy className="h-12 w-12 text-yellow-500" />
                <div>
                  <p className="text-gray-600 mb-1">Winner</p>
                  <h2 className="text-2xl mb-1">{results[0].name}</h2>
                  <div className="flex items-center gap-3">
                    {results[0].party && <Badge>{results[0].party}</Badge>}
                    <span className="text-gray-700">
                      {results[0].votes} votes ({results[0].percentage}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        {results.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <h3 className="text-xl">Vote Distribution</h3>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="votes" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl">Vote Percentage</h3>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${((entry.value / stats!.totalVotes) * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Results */}
        <div>
          <h2 className="text-2xl mb-4">Detailed Results</h2>
          <div className="space-y-4">
            {results.map((candidate, index) => (
              <Card key={candidate._id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="text-3xl text-gray-400">#{index + 1}</div>
                    {candidate.photo ? (
                      <ImageWithFallback
                        src={candidate.photo}
                        alt={candidate.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                        <span className="text-white text-xl">{candidate.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl mb-1">{candidate.name}</h3>
                      {candidate.party && <Badge variant="outline">{candidate.party}</Badge>}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl mb-1">{candidate.votes}</p>
                      <p className="text-gray-600">votes</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Vote share</span>
                      <span>{candidate.percentage}%</span>
                    </div>
                    <Progress value={candidate.percentage} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}