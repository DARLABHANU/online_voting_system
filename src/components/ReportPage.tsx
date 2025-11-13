import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

export default function ReportPage() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/report`, {
        subject,
        description,
      });
      setSuccess(true);
      toast.success('Report submitted successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to submit report';
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
            <h2 className="text-2xl">Report Submitted!</h2>
            <p className="text-gray-600">
              Thank you for your feedback. We'll review your report and take appropriate action.
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
          <h1 className="text-3xl mb-2">Report an Issue</h1>
          <p className="text-gray-600">Help us improve by reporting problems or sharing feedback</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <h2 className="text-xl">Issue Report Form</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Brief summary of the issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  required
                />
                <p className="text-gray-500">
                  Please include as much detail as possible to help us address your concern
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}