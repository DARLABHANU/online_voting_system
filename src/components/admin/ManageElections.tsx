import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
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

export default function ManageElections() {
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingElection, setEditingElection] = useState<Election | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    eligibility: 'general',
  });

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await axios.get(`${API_URL}/elections`);
      setElections(response.data);
    } catch (error: any) {
      toast.error('Failed to load elections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (election?: Election) => {
    if (election) {
      setEditingElection(election);
      setFormData({
        title: election.title,
        start: new Date(election.start).toISOString().slice(0, 16),
        end: new Date(election.end).toISOString().slice(0, 16),
        eligibility: election.eligibility,
      });
    } else {
      setEditingElection(null);
      setFormData({
        title: '',
        start: '',
        end: '',
        eligibility: 'general',
      });
    }
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingElection) {
        await axios.put(`${API_URL}/admin/elections/${editingElection._id}`, formData);
        toast.success('Election updated successfully');
      } else {
        await axios.post(`${API_URL}/admin/elections`, formData);
        toast.success('Election created successfully');
      }
      setShowDialog(false);
      fetchElections();
    } catch (error: any) {
      toast.error(editingElection ? 'Failed to update election' : 'Failed to create election');
    }
  };

  const handleDelete = async (electionId: string) => {
    if (!confirm('Are you sure you want to delete this election? This will also delete all associated candidates and votes.')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/admin/elections/${electionId}`);
      toast.success('Election deleted successfully');
      fetchElections();
    } catch (error: any) {
      toast.error('Failed to delete election');
    }
  };

  const getElectionStatus = (election: Election) => {
    const now = new Date();
    const start = new Date(election.start);
    const end = new Date(election.end);

    if (now < start) return { label: 'Upcoming', color: 'bg-blue-500' };
    if (now > end) return { label: 'Ended', color: 'bg-gray-500' };
    return { label: 'Active', color: 'bg-green-500' };
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
        <h2 className="text-2xl">Manage Elections</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Create Election
        </Button>
      </div>

      <div className="space-y-4">
        {elections.map((election) => {
          const status = getElectionStatus(election);
          return (
            <Card key={election._id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl">{election.title}</h3>
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                    <div className="space-y-1 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Start: {new Date(election.start).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>End: {new Date(election.end).toLocaleString()}</span>
                      </div>
                      <div>
                        <Badge variant="outline">{election.eligibility}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleOpenDialog(election)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(election._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingElection ? 'Edit Election' : 'Create Election'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Election Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eligibility">Eligibility</Label>
                <Select
                  value={formData.eligibility}
                  onValueChange={(value) => setFormData({ ...formData, eligibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start">Start Date & Time *</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={formData.start}
                  onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end">End Date & Time *</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={formData.end}
                  onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingElection ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}