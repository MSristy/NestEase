'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface JobApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  coverLetter: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  experience?: string;
  education?: string;
  skills?: string;
  expectedSalary?: string;
  noticePeriod?: string;
  availability?: string;
  status: 'pending' | 'reviewing' | 'interview' | 'hired' | 'rejected';
  adminNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export default function JobApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [interviewDetails, setInterviewDetails] = useState({
    date: '',
    time: '',
    location: '',
    type: 'In-person'
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/careers/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: number, status: string, notes?: string, rejectionReason?: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      let adminNotesText = notes || '';
      
      // If scheduling interview, include interview details
      if (status === 'interview' && interviewDetails.date && interviewDetails.time) {
        adminNotesText = `Date: ${interviewDetails.date}, Time: ${interviewDetails.time}, Location: ${interviewDetails.location}, Type: ${interviewDetails.type}\n\n${adminNotesText}`;
      }

      const response = await fetch(`http://localhost:3001/careers/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminNotes: adminNotesText,
          rejectionReason,
        }),
      });

      if (response.ok) {
        fetchApplications();
        setShowModal(false);
        setShowRejectModal(false);
        setAdminNotes('');
        setRejectionReason('');
        setInterviewDetails({ date: '', time: '', location: '', type: 'In-person' });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const deleteApplication = async (id: number) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/careers/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'reviewing': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'interview': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'hired': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'rejected': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card p-6 rounded-xl shadow border border-border">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Job Applications</h1>
          <p className="text-muted-foreground text-lg">Manage and review job applications from candidates</p>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-xl shadow border border-border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, or position..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="interview">Interview</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Application Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No job applications found.
            </div>
          ) : (
            filteredApplications.map(app => (
              <div key={app.id} className="bg-card p-6 rounded-xl shadow border border-border flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-card-foreground">{app.firstName} {app.lastName}</h2>
                    <p className="text-muted-foreground text-sm">{app.position} &mdash; {app.department}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
                </div>
                <div className="text-muted-foreground text-sm mb-2">
                  <span>{app.email}</span> &bull; <span>{app.phone}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
                  {app.skills && app.skills.split(',').map((skill, i) => (
                    <span key={i} className="bg-muted px-2 py-1 rounded-full">{skill.trim()}</span>
                  ))}
                </div>
                <div className="text-muted-foreground text-xs mb-2">Applied: {formatDate(app.createdAt)}</div>
                <div className="flex gap-2 mt-auto">
                  <button
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    onClick={() => { setSelectedApplication(app); setShowModal(true); }}
                  >
                    Review
                  </button>
                  <button
                    className="bg-destructive text-white px-4 py-2 rounded-lg font-semibold hover:bg-destructive/90 transition-colors"
                    onClick={() => deleteApplication(app.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedApplication.firstName} {selectedApplication.lastName}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                  <p className="text-muted-foreground"><span className="font-medium">Email:</span> {selectedApplication.email}</p>
                  <p className="text-muted-foreground"><span className="font-medium">Phone:</span> {selectedApplication.phone}</p>
                  <p className="text-muted-foreground"><span className="font-medium">Position:</span> {selectedApplication.position}</p>
                  <p className="text-muted-foreground"><span className="font-medium">Department:</span> {selectedApplication.department}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Application Details</h3>
                  <p className="text-muted-foreground"><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                    </span>
                  </p>
                  <p className="text-muted-foreground"><span className="font-medium">Applied:</span> {formatDate(selectedApplication.createdAt)}</p>
                  <p className="text-muted-foreground"><span className="font-medium">Expected Salary:</span> {selectedApplication.expectedSalary || 'Not specified'}</p>
                  <p className="text-muted-foreground"><span className="font-medium">Notice Period:</span> {selectedApplication.noticePeriod || 'Not specified'}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-2">Cover Letter</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>
              </div>

              {selectedApplication.experience && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Experience</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedApplication.experience}</p>
                  </div>
                </div>
              )}

              {selectedApplication.education && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Education</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedApplication.education}</p>
                  </div>
                </div>
              )}

              {selectedApplication.skills && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Skills</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedApplication.skills}</p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-2">Admin Notes</h3>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add admin notes..."
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground mb-4"
                  rows={3}
                />
                
                {/* Interview Details Section */}
                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-foreground mb-3">Interview Details (for scheduling interviews)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Interview Date
                      </label>
                      <input
                        type="date"
                        value={interviewDetails.date}
                        onChange={(e) => setInterviewDetails(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Interview Time
                      </label>
                      <input
                        type="time"
                        value={interviewDetails.time}
                        onChange={(e) => setInterviewDetails(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={interviewDetails.location}
                        onChange={(e) => setInterviewDetails(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., Office, Zoom, etc."
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Interview Type
                      </label>
                      <select
                        value={interviewDetails.type}
                        onChange={(e) => setInterviewDetails(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      >
                        <option value="In-person">In-person</option>
                        <option value="Video Call">Video Call</option>
                        <option value="Phone">Phone</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'reviewing', adminNotes)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Mark as Reviewing
                </button>
                <button
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'interview', adminNotes)}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Schedule Interview
                </button>
                <button
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'hired', adminNotes)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Hire
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(true);
                    setShowModal(false);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Reject Application</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection..."
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 border border-border text-muted-foreground rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', adminNotes, rejectionReason)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 