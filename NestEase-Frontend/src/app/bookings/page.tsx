'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FaCalendarAlt, FaMapMarkerAlt, FaTimes, FaCheck, FaSpinner, FaStar, FaDownload, FaHistory } from 'react-icons/fa';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Booking {
  id: string;
  property: {
    id: string;
    title: string;
    images: string[];
    address: string;
    city: string;
    state: string;
  };
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/bookings', {
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

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3001/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
      console.error('Error cancelling booking:', error);
    } finally {
      setCancellingId(null);
    }
  };

  const handleSubmitReview = async (bookingId: string) => {
    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3001/bookings/${bookingId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      toast.success('Review submitted successfully');
      fetchBookings();
      setSelectedBooking(null);
      setReviewRating(0);
      setReviewComment('');
    } catch (error) {
      toast.error('Failed to submit review');
      console.error('Error submitting review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleExportBookings = async (format: 'pdf' | 'csv') => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3001/bookings/export?format=${format}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export bookings');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Bookings exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export bookings');
      console.error('Error exporting bookings:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'cancelled':
        return 'text-red-500';
      case 'completed':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const isPast = new Date(booking.checkOutDate) < new Date();
    return matchesStatus && (activeTab === 'upcoming' ? !isPast : isPast);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <div className="flex items-center gap-4">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExportBookings('pdf')}
              className="flex items-center gap-2"
            >
              <FaDownload /> PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExportBookings('csv')}
              className="flex items-center gap-2"
            >
              <FaDownload /> CSV
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Stays</TabsTrigger>
          <TabsTrigger value="past">Past Stays</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
                    <Image
                      src={booking.property.images[0] || '/placeholder-property.jpg'}
                      alt={booking.property.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{booking.property.title}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{booking.property.address}, {booking.property.city}, {booking.property.state}</span>
                        </div>
                      </div>
                      <div className={`font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Check-in</div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-600" />
                          <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Check-out</div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-600" />
                          <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <div className="text-sm text-gray-500">Total Amount</div>
                        <div className="text-xl font-bold">${booking.totalAmount.toLocaleString()}</div>
                      </div>
                      <div className="space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Booking Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm text-gray-500">Booking ID</div>
                                  <div>{booking.id}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Status</div>
                                  <div className={getStatusColor(booking.status)}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Check-in</div>
                                  <div>{new Date(booking.checkInDate).toLocaleDateString()}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Check-out</div>
                                  <div>{new Date(booking.checkOutDate).toLocaleDateString()}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Total Amount</div>
                                  <div>${booking.totalAmount.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Booked On</div>
                                  <div>{new Date(booking.createdAt).toLocaleDateString()}</div>
                                </div>
                              </div>

                              {booking.status === 'completed' && !booking.review && (
                                <div className="space-y-4 pt-4 border-t">
                                  <h3 className="font-semibold">Write a Review</h3>
                                  <div className="space-y-2">
                                    <Label>Rating</Label>
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          onClick={() => setReviewRating(star)}
                                          className="text-2xl"
                                        >
                                          <FaStar
                                            className={star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Comment</Label>
                                    <Textarea
                                      value={reviewComment}
                                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewComment(e.target.value)}
                                      placeholder="Share your experience..."
                                      rows={4}
                                    />
                                  </div>
                                  <Button
                                    onClick={() => handleSubmitReview(booking.id)}
                                    disabled={!reviewRating || !reviewComment || submittingReview}
                                  >
                                    {submittingReview ? (
                                      <FaSpinner className="animate-spin mr-2" />
                                    ) : (
                                      <FaCheck className="mr-2" />
                                    )}
                                    Submit Review
                                  </Button>
                                </div>
                              )}

                              {booking.review && (
                                <div className="pt-4 border-t">
                                  <h3 className="font-semibold mb-2">Your Review</h3>
                                  <div className="flex items-center gap-2 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar
                                        key={i}
                                        className={i < booking.review!.rating ? 'text-yellow-400' : 'text-gray-300'}
                                      />
                                    ))}
                                  </div>
                                  <p className="text-gray-600">{booking.review.comment}</p>
                                  <div className="text-sm text-gray-500 mt-2">
                                    Posted on {new Date(booking.review.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          onClick={() => router.push(`/property/${booking.property.id}`)}
                        >
                          View Property
                        </Button>
                        {booking.status === 'confirmed' && (
                          <Button
                            variant="destructive"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                          >
                            {cancellingId === booking.id ? (
                              <FaSpinner className="animate-spin mr-2" />
                            ) : (
                              <FaTimes className="mr-2" />
                            )}
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {statusFilter === 'all'
                ? "You haven't made any bookings yet."
                : `No ${statusFilter} bookings found.`}
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push('/property')}
            >
              Browse Properties
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 