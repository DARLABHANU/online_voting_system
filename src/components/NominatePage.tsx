import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

interface Election {
  _id: string;
  title: string;
  start: string;
  end: string;
}

export default function NominatePage() {
  const navigate = useNavigate();
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [party, setParty] = useState('');
  const [manifesto, setManifesto] = useState('');
  const [photo, setPhoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await axios.get(`${API_URL}/elections`);
      const activeElections = response.data.filter((e: Election) => new Date(e.end) > new Date());
      setElections(activeElections);
    } catch (error: any) {
      toast.error('Failed to load elections');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedElection) {
      toast.error('Please select an election');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/nominate`, {
        electionId: selectedElection,
        party,
        manifesto,
        photo,
      });
      setSuccess(true);
      toast.success('Nomination submitted successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to submit nomination';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl">Nomination Submitted!</h2>
            <p className="text-gray-600">
              Your nomination has been submitted successfully. Please wait for admin approval.
            </p>
            <p className="text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Nominate Yourself</h1>
          <p className="text-gray-600">Submit your candidacy for an upcoming election</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <h2 className="text-xl">Nomination Form</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-800">
                    Your nomination will be reviewed by administrators before being approved.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="election">Select Election *</Label>
                <Select value={selectedElection} onValueChange={setSelectedElection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an election" />
                  </SelectTrigger>
                  <SelectContent>
                    {elections.map((election) => (
                      <SelectItem key={election._id} value={election._id}>
                        {election.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="party">Party Name (Optional)</Label>
                <Input
                  id="party"
                  type="text"
                  placeholder="Independent, Democratic Party, etc."
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo URL (Optional)</Label>
                <Input
                  id="photo"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manifesto">Your Manifesto (Optional)</Label>
                <Textarea
                  id="manifesto"
                  placeholder="Describe your vision and what you stand for..."
                  value={manifesto}
                  onChange={(e) => setManifesto(e.target.value)}
                  rows={6}
                />
                <p className="text-gray-500">Share your goals and why voters should choose you</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Nomination'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}