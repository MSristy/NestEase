'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FaCheck, FaTimes, FaClock, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Booking {
  id: number;
  customer: string;
  customerEmail: string;
  serviceType: string;
  serviceDate: string;
  serviceTime: string;
  duration: number;
  address: string;
  notes: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'completed';
  totalAmount: number;
  createdAt: string;
  rejectionReason?: string;
}

export default function ServiceProviderDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
  }, [user]);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/service-providers/my-bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-providers/bookings/${bookingId}/approve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve booking');
      }

      toast.success('Booking approved successfully');
      fetchMyBookings();
    } catch (error) {
      toast.error('Failed to approve booking');
      console.error('Error approving booking:', error);
    }
  };

  const handleRejectBooking = async () => {
    if (!selectedBooking || !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-providers/bookings/${selectedBooking.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject booking');
      }

      toast.success('Booking rejected successfully');
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedBooking(null);
      fetchMyBookings();
    } catch (error) {
      toast.error('Failed to reject booking');
      console.error('Error rejecting booking:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user || user.role !== 'SERVICE_PROVIDER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-gray-600">Access denied. Only service providers can view this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Service Provider Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your service bookings and approvals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{booking.serviceType}</CardTitle>
                {getStatusBadge(booking.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUser className="text-blue-500" />
                  <span>{booking.customer}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="text-green-500" />
                  <span>{booking.serviceDate} at {booking.serviceTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock className="text-purple-500" />
                  <span>{booking.duration} hour(s)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{booking.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaDollarSign className="text-green-500" />
                  <span className="font-semibold">৳{booking.totalAmount}</span>
                </div>
              </div>

              {booking.notes && (
                <div className="text-sm text-gray-600">
                  <strong>Notes:</strong> {booking.notes}
                </div>
              )}

              {booking.rejectionReason && (
                <div className="text-sm text-red-600">
                  <strong>Rejection Reason:</strong> {booking.rejectionReason}
                </div>
              )}

              {booking.status === 'pending_approval' && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleApproveBooking(booking.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <FaCheck className="mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowRejectDialog(true);
                    }}
                    variant="destructive"
                    className="flex-1"
                  >
                    <FaTimes className="mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
          <p className="text-gray-600">You haven't received any booking requests yet.</p>
        </div>
      )}

      {/* Reject Booking Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Reject Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm">
              <h4 className="font-medium mb-2">Booking Details</h4>
              {selectedBooking && (
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p><strong>Service:</strong> {selectedBooking.serviceType}</p>
                  <p><strong>Date:</strong> {new Date(selectedBooking.serviceDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedBooking.serviceTime}</p>
                  <p><strong>Address:</strong> {selectedBooking.address}</p>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="rejectionReason" className="text-sm font-medium">Reason for Rejection</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a clear reason for rejecting this booking..."
                rows={4}
                className="mt-2 bg-background text-foreground border-border focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleRejectBooking}
                variant="destructive"
                className="flex-1"
                disabled={!rejectionReason.trim()}
              >
                Reject Booking
              </Button>
              <Button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason('');
                  setSelectedBooking(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
