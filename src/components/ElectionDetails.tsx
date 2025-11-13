import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { ArrowLeft, CheckCircle, FileText, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { BarChart3 } from 'lucide-react';

import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

interface Candidate {
  _id: string;
  name: string;
  party: string;
  photo?: string;
  manifesto?: string;
}

export default function ElectionDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, [id]);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API_URL}/election/${id}/candidates`);
      setCandidates(response.data.candidates);
      setHasVoted(response.data.hasVoted);
    } catch (error: any) {
      toast.error('Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowConfirmDialog(true);
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;

    setIsVoting(true);
    try {
      await axios.post(`${API_URL}/vote`, {
        candidateId: selectedCandidate._id,
        electionId: id,
      });
      toast.success('Vote cast successfully!');
      setHasVoted(true);
      setShowConfirmDialog(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to cast vote';
      toast.error(errorMessage);
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl mb-2">Election Candidates</h1>
              {hasVoted && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>You have already voted in this election</span>
                </div>
              )}
            </div>
            <Link to={`/results/${id}`}>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Results
              </Button>
            </Link>
          </div>
        </div>

        {candidates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl mb-2">No Candidates Yet</h3>
              <p className="text-gray-600">Candidates will appear here once they are approved.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <Card key={candidate._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-4">
                    {candidate.photo ? (
                      <ImageWithFallback
                        src={candidate.photo}
                        alt={candidate.name}
                        className="h-32 w-32 rounded-full object-cover mb-4"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center mb-4">
                        <span className="text-white text-3xl">{candidate.name.charAt(0)}</span>
                      </div>
                    )}
                    <h3 className="text-xl mb-2">{candidate.name}</h3>
                    {candidate.party && (
                      <Badge variant="outline">{candidate.party}</Badge>
                    )}
                  </div>

                  {candidate.manifesto && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{candidate.manifesto}</p>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={() => handleVoteClick(candidate)}
                    disabled={hasVoted}
                  >
                    {hasVoted ? 'Already Voted' : 'Vote for this Candidate'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Your Vote</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="mb-4">
                Are you sure you want to vote for <strong>{selectedCandidate?.name}</strong>
                {selectedCandidate?.party && ` from ${selectedCandidate.party}`}?
              </p>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  ⚠️ This action cannot be undone. You can only vote once per election.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isVoting}>
                Cancel
              </Button>
              <Button onClick={handleConfirmVote} disabled={isVoting}>
                {isVoting ? 'Casting Vote...' : 'Confirm Vote'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}