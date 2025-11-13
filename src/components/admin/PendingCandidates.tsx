import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

interface PendingCandidate {
  _id: string;
  name: string;
  party: string;
  electionId: string;
  photo?: string;
  manifesto?: string;
  createdAt: string;
}

export default function PendingCandidates() {
  const [candidates, setCandidates] = useState<PendingCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPendingCandidates();
  }, []);

  const fetchPendingCandidates = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/pending-candidates`);
      setCandidates(response.data);
    } catch (error: any) {
      toast.error('Failed to load pending candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (candidateId: string) => {
    try {
      await axios.post(`${API_URL}/admin/approve-candidate/${candidateId}`);
      toast.success('Candidate approved successfully');
      fetchPendingCandidates();
    } catch (error: any) {
      toast.error('Failed to approve candidate');
    }
  };

  const handleReject = async (candidateId: string) => {
    try {
      await axios.post(`${API_URL}/admin/reject-candidate/${candidateId}`);
      toast.success('Candidate nomination rejected');
      fetchPendingCandidates();
    } catch (error: any) {
      toast.error('Failed to reject candidate');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl mb-2">No Pending Candidates</h3>
          <p className="text-gray-600">All candidate nominations have been processed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl mb-4">Pending Candidate Approvals</h2>
      {candidates.map((candidate) => (
        <Card key={candidate._id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div>
                {candidate.photo ? (
                  <ImageWithFallback
                    src={candidate.photo}
                    alt={candidate.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-2xl">{candidate.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-2">{candidate.name}</h3>
                <div className="space-y-2 mb-4">
                  {candidate.party && <Badge>{candidate.party}</Badge>}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Nominated: {new Date(candidate.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {candidate.manifesto && (
                  <div className="p-3 bg-gray-50 rounded-lg mb-4">
                    <p className="text-gray-700">{candidate.manifesto}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => handleApprove(candidate._id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleReject(candidate._id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}