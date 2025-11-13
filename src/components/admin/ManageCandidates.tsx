import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

interface Candidate {
  _id: string;
  name: string;
  party: string;
  electionId: string;
  photo?: string;
  manifesto?: string;
}

interface Election {
  _id: string;
  title: string;
}

export default function ManageCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    party: '',
    electionId: '',
    photo: '',
    manifesto: '',
  });

  useEffect(() => {
    fetchCandidates();
    fetchElections();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/candidates`);
      setCandidates(response.data);
    } catch (error: any) {
      toast.error('Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchElections = async () => {
    try {
      const response = await axios.get(`${API_URL}/elections`);
      setElections(response.data);
    } catch (error: any) {
      console.error('Failed to load elections');
    }
  };

  const handleOpenDialog = (candidate?: Candidate) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setFormData({
        name: candidate.name,
        party: candidate.party,
        electionId: candidate.electionId,
        photo: candidate.photo || '',
        manifesto: candidate.manifesto || '',
      });
    } else {
      setEditingCandidate(null);
      setFormData({
        name: '',
        party: '',
        electionId: '',
        photo: '',
        manifesto: '',
      });
    }
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCandidate) {
        await axios.put(`${API_URL}/admin/candidates/${editingCandidate._id}`, formData);
        toast.success('Candidate updated successfully');
      } else {
        await axios.post(`${API_URL}/admin/candidates`, formData);
        toast.success('Candidate created successfully');
      }
      setShowDialog(false);
      fetchCandidates();
    } catch (error: any) {
      toast.error(editingCandidate ? 'Failed to update candidate' : 'Failed to create candidate');
    }
  };

  const handleDelete = async (candidateId: string) => {
    if (!confirm('Are you sure you want to delete this candidate?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/admin/candidates/${candidateId}`);
      toast.success('Candidate deleted successfully');
      fetchCandidates();
    } catch (error: any) {
      toast.error('Failed to delete candidate');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Manage Candidates</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
          <Card key={candidate._id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {candidate.photo ? (
                  <ImageWithFallback
                    src={candidate.photo}
                    alt={candidate.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xl">{candidate.name.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg mb-1">{candidate.name}</h3>
                  {candidate.party && <Badge className="mb-2">{candidate.party}</Badge>}
                  {candidate.manifesto && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">{candidate.manifesto}</p>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(candidate)}>
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(candidate._id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCandidate ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="electionId">Election *</Label>
                <Select
                  value={formData.electionId}
                  onValueChange={(value) => setFormData({ ...formData, electionId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an election" />
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
                <Label htmlFor="party">Party</Label>
                <Input
                  id="party"
                  value={formData.party}
                  onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo URL</Label>
                <Input
                  id="photo"
                  type="url"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manifesto">Manifesto</Label>
                <Textarea
                  id="manifesto"
                  value={formData.manifesto}
                  onChange={(e) => setFormData({ ...formData, manifesto: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCandidate ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}