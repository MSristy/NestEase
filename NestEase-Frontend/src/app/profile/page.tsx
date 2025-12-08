'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { FaCheck, FaTimes, FaClock, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaCreditCard, FaSpinner, FaPhone } from 'react-icons/fa';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import RoleSwitcher from '@/components/RoleSwitcher';
import { useRef } from 'react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ExchangeProduct {
  id: number;
  yourName: string;
  yourPhone: string;
  yourEmail: string;
  productName: string;
  category: string;
  itemCondition: string;
  location: string;
  description: string;
  images: string;
  createdAt: string;
  status?: string;
}

interface SwapItem {
  id: number;
  title: string;
  category: string;
  condition: string;
  description: string;
  location: string;
  image: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, updateUser, checkAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [exchangeProducts, setExchangeProducts] = useState<ExchangeProduct[]>([]);
  const [swapItems, setSwapItems] = useState<SwapItem[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
  });
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    } else {
      if (pathname) {
        localStorage.setItem('intendedDestination', pathname);
      }
      router.push('/auth/login');
    }
    // eslint-disable-next-line
  }, []);

  // Only set form data from user when user changes and NOT when editing
  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || '',
      });
    }
  }, [user, isEditing]);

  // Debug: Log user and loading state
  useEffect(() => {
    console.log('ProfilePage user:', user);
    console.log('ProfilePage loading:', loading);
  }, [user, loading]);

  // Fetch exchange products when user changes
  useEffect(() => {
    const fetchExchangeProducts = async () => {
      if (user?.email) {
        try {
          const token = localStorage.getItem('token') as string;
          if (!token) {
            throw new Error('No authentication token found');
          }
          const response = await fetch(`http://localhost:3001/exchange/user/${encodeURIComponent(user.email)}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch exchange products');
          }
          const data = await response.json();
          if (data.success) {
            setExchangeProducts(data.data);
          } else {
            setExchangeProducts([]);
          }
        } catch (error) {
          console.error('Error fetching exchange products:', error);
          toast.error('Failed to fetch exchange products');
          setExchangeProducts([]);
        }
      }
    };

    fetchExchangeProducts();
  }, [user?.email]);

  // Add this useEffect to fetch swap items
  useEffect(() => {
    const fetchSwapItems = async () => {
      if (user?.email) {
        try {
          const token = localStorage.getItem('token') as string;
          if (!token) {
            throw new Error('No authentication token found');
          }
          const response = await fetch(`http://localhost:3001/add-swap/user/${encodeURIComponent(user.email)}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch swap items');
          }
          const data = await response.json();
          if (data.success) {
            setSwapItems(data.data);
          }
        } catch (error) {
          console.error('Error fetching swap items:', error);
          toast.error('Failed to fetch swap items');
        }
      }
    };

    fetchSwapItems();
  }, [user?.email]);

  // Fetch notifications when user changes
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.id) {
        try {
          const token = localStorage.getItem('token') as string;
          if (!token) {
            throw new Error('No authentication token found');
          }
          const response = await fetch('http://localhost:3001/users/user-notifications', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch notifications');
          }
          const data = await response.json();
          setNotifications(data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement | null;
        if (target) {
          handleAvatarChange({ target } as React.ChangeEvent<HTMLInputElement>);
        }
      };
      input.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const token = localStorage.getItem('token') as string;
      if (!token) {
        if (pathname) {
          localStorage.setItem('intendedDestination', pathname);
        }
        router.push('/auth/login');
        return;
      }

    const formDataObj = new FormData();
    formDataObj.append('avatar', file);

      const response = await fetch('http://localhost:3001/users/profile/avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataObj,
      });
      if (!response.ok) throw new Error('Failed to upload avatar');
      const updatedUser = await response.json();
      
      // Update the user state in the auth context
      updateUser(updatedUser);
      
      // Update local form data to reflect changes immediately
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        address: updatedUser.address || '',
        avatar: updatedUser.avatar || '',
      });
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveStatus('saving');

    try {
      const token = localStorage.getItem('token') as string;
      if (!token) {
        if (pathname) {
          localStorage.setItem('intendedDestination', pathname);
        }
        router.push('/auth/login');
        return;
      }

      const response = await fetch('http://localhost:3001/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          if (pathname) {
            localStorage.setItem('intendedDestination', pathname);
          }
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update the user state in the auth context
      updateUser(updatedUser);
      
      // Update local form data to reflect changes immediately
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        address: updatedUser.address || '',
        avatar: updatedUser.avatar || '',
      });
      
      setSaveStatus('saved');
      setIsEditing(false);
      toast.success('Profile updated successfully');
      
      // Reset save status after showing success
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus('error');
      toast.error('Failed to update profile');
      
      // Reset save status after showing error
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (productId: number) => {
    try {
      setIsProcessing(productId);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:3001/exchange/${productId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to accept exchange offer');
      }

      setExchangeProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, status: 'accepted' }
            : product
        )
      );

      toast.success('Exchange offer accepted successfully');
    } catch (error) {
      console.error('Error accepting exchange offer:', error);
      toast.error('Failed to accept exchange offer');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDecline = async (productId: number) => {
    try {
      setIsProcessing(productId);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:3001/exchange/${productId}/decline`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to decline exchange offer');
      }

      setExchangeProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, status: 'declined' }
            : product
        )
      );

      toast.success('Exchange offer declined successfully');
    } catch (error) {
      console.error('Error declining exchange offer:', error);
      toast.error('Failed to decline exchange offer');
    } finally {
      setIsProcessing(null);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      toast.error('All fields are required');
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword: passwordForm.current, newPassword: passwordForm.next }),
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Failed to change password');
      }
      toast.success('Password changed successfully!');
      setShowPasswordDialog(false);
      setPasswordForm({ current: '', next: '', confirm: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- Service Provider Bookings Section ---
  function ServiceProviderBookingsSection({ user }: { user: any }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchMyBookings = async () => {
      if (!(user?.id && user.role?.toLowerCase() === 'service_provider')) return;
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/service-providers/my-bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchMyBookings();
    }, [user?.id, user?.role]);

    const handleApproveBooking = async (bookingId: string) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/service-providers/bookings/${bookingId}/approve`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to approve booking');
        toast.success('Booking approved successfully');
        fetchMyBookings();
      } catch {
        toast.error('Failed to approve booking');
      }
    };

    const handleRejectBooking = async (): Promise<void> => {
      if (!selectedBooking || !rejectionReason.trim()) {
        toast.error('Please provide a reason for rejection');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/service-providers/bookings/${selectedBooking.id}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ reason: rejectionReason }),
        });
        if (!response.ok) throw new Error('Failed to reject booking');
        toast.success('Booking rejected successfully');
        setShowRejectDialog(false);
        setRejectionReason('');
        setSelectedBooking(null);
        fetchMyBookings();
      } catch {
        toast.error('Failed to reject booking');
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

    if (!user || user.role?.toLowerCase() !== 'service_provider') return null;

    return (
      <div className="mt-12">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-700 text-center tracking-tight drop-shadow">Service Bookings & Approvals</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600">You haven't received any booking requests yet.</p>
          </div>
        ) : (
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
                      <span className="font-semibold">৳ {booking.totalAmount}</span>
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
        )}
        {/* Reject Dialog */}
        {showRejectDialog && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 w-full max-w-md border">
              <h3 className="text-xl font-semibold mb-4">Reject Booking</h3>
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2 text-sm">Booking Details</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p><strong>Service:</strong> {selectedBooking.serviceType}</p>
                  <p><strong>Date:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedBooking.time}</p>
                  <p><strong>Address:</strong> {selectedBooking.address}</p>
                </div>
              </div>
              
              <Label htmlFor="rejectionReason" className="text-sm font-medium">Reason for Rejection</Label>
              <Textarea
                id="rejectionReason"
                className="w-full mt-2 mb-4 bg-background text-foreground border-border focus:ring-2 focus:ring-primary focus:border-primary"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Please provide a clear reason for rejecting this booking..."
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button 
                  onClick={() => setShowRejectDialog(false)} 
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleRejectBooking} 
                  variant="destructive"
                  disabled={!rejectionReason.trim()}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Seller Bookings & Approvals Section ---
  function SellerBookingsSection({ user }) {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    const fetchPurchases = () => {
      if (!user || user.role?.toLowerCase() !== 'seller') return;
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      fetch('http://localhost:3001/properties/pending-purchases', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          setPurchases(Array.isArray(data) ? data : data.data || []);
          setLoading(false);
        })
        .catch((error) => {
          setError('Failed to fetch pending purchases');
          setLoading(false);
        });
    };

    useEffect(() => {
      fetchPurchases();
    }, [user?.id, user?.role]);

    const handleApprove = async (purchaseId) => {
      setActionLoading(purchaseId);
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3001/properties/purchases/${purchaseId}/approve`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast.success('Purchase approved successfully');
        fetchPurchases();
      } catch (error) {
        console.error('Error approving purchase:', error);
        toast.error('Failed to approve purchase');
      } finally {
        setActionLoading(null);
      }
    };

    const handleReject = async (purchaseId) => {
      setActionLoading(purchaseId);
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3001/properties/purchases/${purchaseId}/reject`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast.success('Purchase rejected successfully');
        fetchPurchases();
      } catch (error) {
        console.error('Error rejecting purchase:', error);
        toast.error('Failed to reject purchase');
      } finally {
        setActionLoading(null);
      }
    };

    if (!user || user.role?.toLowerCase() !== 'seller') return null;

    return (
      <div className="mt-12">
        <h2 className="text-3xl font-extrabold mb-6 text-purple-700 text-center tracking-tight drop-shadow">Seller Bookings & Approvals</h2>
        <div className="rounded-xl shadow p-6 mb-8 bg-inherit">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center">{error}</div>
          ) : purchases.length === 0 ? (
            <p className="text-gray-500 text-center">No bookings yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchases.map((purchase) => (
                <Card key={purchase.id} className="mb-2">
                  <CardHeader>
                    <CardTitle>{purchase.property?.title || 'Property'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 text-sm mb-1">Buyer: {purchase.buyer?.name} ({purchase.buyer?.email})</div>
                    <div className="text-gray-700 text-sm mb-1">Address: {purchase.property?.address}</div>
                    <div className="text-gray-700 text-sm mb-1">City: {purchase.property?.city}</div>
                    <div className="text-gray-700 text-sm mb-1">Status: <strong>{purchase.status}</strong></div>
                    <div className="text-gray-700 text-sm mb-1">Total Price: ৳ {purchase.totalPrice}</div>
                    {purchase.rejectionReason && (
                      <div className="text-sm text-red-600">
                        <strong>Rejection Reason:</strong> {purchase.rejectionReason}
                      </div>
                    )}
                    {purchase.status === 'PENDING' && (
                      <div className="flex gap-2 pt-4">
                        <Button onClick={() => handleApprove(purchase.id)} disabled={actionLoading === purchase.id} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                          Approve
                        </Button>
                        <Button onClick={() => handleReject(purchase.id)} disabled={actionLoading === purchase.id} variant="destructive" className="flex-1">
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Buyer Purchases Section ---
  function BuyerPurchasesSection({ user }) {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      if (user?.id && user.role?.toLowerCase() === 'buyer') {
        const fetchPurchases = async () => {
          try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/properties/my-bookings', {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch purchases');
            const data = await response.json();
            setPurchases(data);
          } catch (error) {
            toast.error('Failed to load purchases');
          } finally {
            setLoading(false);
          }
        };
        fetchPurchases();
      }
    }, [user?.id, user?.role]);
    if (!user || user.role?.toLowerCase() !== 'buyer') return null;
    return (
      <div className="mt-12">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center tracking-tight drop-shadow">My Property Purchases</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Property Purchases Yet</h3>
            <Button 
              className="mt-4"
              onClick={() => router.push('/property')}
            >
              Browse Properties
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{purchase.property.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span>{purchase.property.address}, {purchase.property.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaDollarSign className="text-green-500" />
                      <span className="font-semibold">৳ {purchase.totalPrice}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaUser className="text-orange-500" />
                      <span>Seller: {purchase.property.owner?.name}</span>
                    </div>
                  </div>
                  {purchase.rejectionReason && (
                    <div className="text-sm text-red-600">
                      <strong>Rejection Reason:</strong> {purchase.rejectionReason}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Landlord Bookings & Approvals Section ---
  function LandlordBookingsSection({ user }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
      if (user?.id && user.role?.toLowerCase() === 'landlord') {
        const fetchPendingRequests = async () => {
          try {
      setLoading(true);
      const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/properties/pending-requests', {
        headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch pending requests');
            const data = await response.json();
            setRequests(data);
          } catch (error) {
            setError('Failed to load pending requests');
            toast.error('Failed to load pending requests');
          } finally {
          setLoading(false);
          }
    };
        fetchPendingRequests();
      }
    }, [user?.id, user?.role]);

    const handleApprove = async (requestId) => {
      setActionLoading(requestId);
      try {
      const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/properties/bookings/${requestId}/approve`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to approve request');
        
        toast.success('Request approved successfully');
        
        // Update the local state to show the approved status
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'CONFIRMED' }
            : req
        ));
      } catch (error) {
        toast.error('Failed to approve request');
      } finally {
        setActionLoading(null);
      }
    };

    const handleReject = async (requestId) => {
      if (!rejectionReason.trim()) {
        toast.error('Please provide a reason for rejection');
        return;
      }
      
      setActionLoading(requestId);
      try {
      const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/properties/bookings/${requestId}/reject`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ reason: rejectionReason }),
        });
        if (!response.ok) throw new Error('Failed to reject request');
        
        toast.success('Request rejected successfully');
        
        // Update the local state to show the rejected status
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'REJECTED', rejectionReason }
            : req
        ));
        
        setShowRejectDialog(false);
        setRejectionReason('');
        setSelectedRequest(null);
      } catch (error) {
        toast.error('Failed to reject request');
      } finally {
        setActionLoading(null);
      }
    };

    const getStatusBadge = (status) => {
      switch (status) {
        case 'PENDING':
          return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
        case 'CONFIRMED':
          return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
        case 'REJECTED':
          return <Badge variant="destructive">Rejected</Badge>;
        case 'COMPLETED':
          return <Badge variant="outline" className="bg-blue-100 text-blue-800">Completed</Badge>;
        default:
          return <Badge variant="outline">{status}</Badge>;
      }
    };

    if (!user || user.role?.toLowerCase() !== 'landlord') return null;

  return (
      <div className="mt-12">
        <h2 className="text-3xl font-extrabold mb-6 text-green-700 text-center tracking-tight drop-shadow">Landlord Bookings & Approvals</h2>
        <div className="rounded-xl shadow p-6 mb-8 bg-inherit">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center">{error}</div>
          ) : requests.length === 0 ? (
            <p className="text-gray-500 text-center">No booking requests yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((req) => (
                <Card key={req.id} className="mb-2">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                    <CardTitle>{req.property?.title || 'Property'}</CardTitle>
                      {getStatusBadge(req.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 text-sm mb-1">
                      <strong>Tenant:</strong> {req.tenant?.name} ({req.tenant?.email})
                    </div>
                    <div className="text-gray-700 text-sm mb-1">
                      <strong>Address:</strong> {req.property?.address}
                    </div>
                    <div className="text-gray-700 text-sm mb-1">
                      <strong>City:</strong> {req.property?.city}
                    </div>
                    <div className="text-gray-700 text-sm mb-1">
                      <strong>Total Price:</strong> ৳ {req.totalPrice}
                    </div>
                    <div className="text-gray-700 text-sm mb-1">
                      <strong>Check-in:</strong> {new Date(req.checkInDate).toLocaleDateString()}
                    </div>
                    <div className="text-gray-700 text-sm mb-1">
                      <strong>Check-out:</strong> {new Date(req.checkOutDate).toLocaleDateString()}
                    </div>
                    <div className="text-gray-700 text-sm mb-1">
                      <strong>Requested:</strong> {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                    
                    {req.rejectionReason && (
                      <div className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded">
                        <strong>Rejection Reason:</strong> {req.rejectionReason}
                      </div>
                    )}
                    
                    {req.status === 'PENDING' && (
                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={() => handleApprove(req.id)} 
                          disabled={actionLoading === req.id} 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          {actionLoading === req.id ? (
                            <>
                              <FaSpinner className="animate-spin mr-2" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <FaCheck className="mr-2" />
                          Approve
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={() => {
                            setSelectedRequest(req);
                            setShowRejectDialog(true);
                          }} 
                          disabled={actionLoading === req.id} 
                          variant="destructive" 
                          className="flex-1"
                        >
                          <FaTimes className="mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                    
                    {req.status === 'CONFIRMED' && (
                      <div className="text-sm text-green-600 mt-2 p-2 bg-green-50 rounded">
                        ✅ Booking approved - waiting for tenant payment
                      </div>
                    )}
                    
                    {req.status === 'REJECTED' && (
                      <div className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded">
                        ❌ Booking rejected
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reject Booking Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Property:</span> {selectedRequest?.property?.title}</p>
                  <p><span className="font-medium">Tenant:</span> {selectedRequest?.tenant?.name} ({selectedRequest?.tenant?.email})</p>
                  <p><span className="font-medium">Amount:</span> ৳{selectedRequest?.totalPrice}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Reason for Rejection *</Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this booking request..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleReject(selectedRequest?.id)}
                  disabled={!rejectionReason.trim() || actionLoading === selectedRequest?.id}
                  variant="destructive"
                  className="flex-1"
                >
                  {actionLoading === selectedRequest?.id ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <FaTimes className="mr-2" />
                      Reject Booking
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectDialog(false);
                    setRejectionReason('');
                    setSelectedRequest(null);
                  }}
                  disabled={actionLoading === selectedRequest?.id}
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

  // --- Swap Items Section ---
  function SwapItemsSection({ user, swapItems }) {
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');

    // Approve/Reject handlers (assuming swapItems have a swapRequests array)
    const handleApprove = async (swapRequestId) => {
      setActionLoading(swapRequestId);
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/save-and-swap/requests/${swapRequestId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionLoading(null);
      // Optionally refresh swap items here
    };

    const handleReject = async (swapRequestId) => {
      setActionLoading(swapRequestId);
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/save-and-swap/requests/${swapRequestId}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionLoading(null);
      // Optionally refresh swap items here
    };

    return (
      <div className="rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">Swap Items</h2>
        {swapItems.length === 0 ? (
          <p className="text-gray-500 dark:text-neutral-400 text-center">No swap items yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {swapItems.map(item => (
              <Card key={item.id} className="mb-2 border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-neutral-200">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-800 dark:text-neutral-200 text-sm mb-1">Category: {item.category}</div>
                  <div className="text-gray-800 dark:text-neutral-200 text-sm mb-1">Condition: {item.condition}</div>
                  <div className="text-gray-800 dark:text-neutral-200 text-sm mb-1">Location: {item.location}</div>
                  {/* Show swap requests if present */}
                  {item.swapRequests && item.swapRequests.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 text-gray-800 dark:text-neutral-100">Swap Requests</h4>
                      {item.swapRequests.map(req => (
                        <div key={req.id} className="p-3 mb-2 rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900">
                          <div className="text-sm text-gray-800 dark:text-neutral-200">From: {req.requester?.name} ({req.requester?.email})</div>
                          <div className="text-sm text-gray-600 dark:text-neutral-400">Status: {req.status}</div>
                          {req.status === 'PENDING' && (
                            <div className="flex gap-2 pt-2">
                              <Button onClick={() => handleApprove(req.id)} disabled={actionLoading === req.id} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                                Approve
                              </Button>
                              <Button onClick={() => handleReject(req.id)} disabled={actionLoading === req.id} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Exchange Offers Section ---
  function ExchangeOffersSection({ exchangeProducts }) {
    return (
      <div className="rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">Exchange Offers</h2>
        {exchangeProducts.length === 0 ? (
          <p className="text-gray-500 dark:text-neutral-400 text-center">No exchange offers yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exchangeProducts.map(product => (
              <Card key={product.id} className="mb-2 border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-neutral-100">{product.productName}</CardTitle>
                </CardHeader>
                <CardContent>
                  {product.images && (
                    <div className="mb-2">
                      <img 
                        src={`http://localhost:3001${product.images}`} 
                        alt={product.productName} 
                        className="w-full h-40 object-cover rounded mb-2"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="text-gray-800 dark:text-neutral-100 text-sm mb-1">Category: {product.category}</div>
                  <div className="text-gray-800 dark:text-neutral-100 text-sm mb-1">Condition: {product.itemCondition}</div>
                  <div className="text-gray-800 dark:text-neutral-100 text-sm mb-1">Location: {product.location}</div>
                  <div className="text-gray-800 dark:text-neutral-100 text-sm mb-1">Status: {product.status || 'pending'}</div>
                  {product.status && product.status.toLowerCase() === 'pending' && (
                    <div className="flex gap-2 pt-4">
          <Button
                        onClick={() => handleAccept(product.id)} 
                        disabled={isProcessing === product.id} 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleDecline(product.id)} 
                        disabled={isProcessing === product.id} 
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        Reject
          </Button>
        </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Interview Notifications Section ---
  function InterviewNotificationsSection({ notifications }) {
    const interviewNotifications = notifications.filter(n => n.type === 'interview');
    
    if (interviewNotifications.length === 0) {
      return null;
    }

    return (
      <div className="rounded-xl shadow p-6 mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-4 flex items-center">
          <FaCalendarAlt className="mr-2" />
          Interview Notifications
        </h2>
        <div className="space-y-4">
          {interviewNotifications.map(notification => (
            <Card key={notification.id} className="border border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="text-purple-800 dark:text-purple-200 text-lg">
                  {notification.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {notification.message}
                </p>
                
                {notification.metadata && (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Interview Details:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {notification.metadata.interviewDate && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">
                            {new Date(notification.metadata.interviewDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {notification.metadata.interviewTime && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Time:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">
                            {notification.metadata.interviewTime}
                          </span>
                        </div>
                      )}
                      {notification.metadata.interviewLocation && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">
                            {notification.metadata.interviewLocation}
                          </span>
                        </div>
                      )}
                      {notification.metadata.interviewType && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">
                            {notification.metadata.interviewType}
                          </span>
                        </div>
                      )}
                      {notification.metadata.position && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Position:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">
                            {notification.metadata.position}
                          </span>
                        </div>
                      )}
                      {notification.metadata.department && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Department:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">
                            {notification.metadata.department}
                          </span>
                        </div>
                      )}
                    </div>
                    {notification.metadata.adminNotes && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Additional Notes:</span>
                        <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                          {notification.metadata.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // --- Tenant Bookings Section ---
  function TenantBookingsSection({ user }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
      if (user?.id) {
        const fetchMyBookings = async () => {
          try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/properties/my-bookings', {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const data = await response.json();
            setBookings(data);
          } catch (error) {
            toast.error('Failed to load bookings');
          } finally {
            setLoading(false);
          }
        };
        fetchMyBookings();
      }
    }, [user?.id]);

    const handlePayment = async (booking) => {
      setSelectedBooking(booking);
      setShowPaymentDialog(true);
    };

    const processPayment = async () => {
      if (!selectedBooking) return;
      
      setProcessingPayment(true);
      try {
        const token = localStorage.getItem('token');
        
        if (paymentMethod === 'online') {
          // Add to cart and redirect to checkout
          const cartItem = {
            id: selectedBooking.id,
            type: 'property' as const,
            name: `${selectedBooking.property.title} - Property Booking`,
            price: selectedBooking.totalPrice || 0,
            quantity: 1,
            image: selectedBooking.property.images?.[0] || '/images/placeholder.jpg',
            propertyBooking: selectedBooking
          };
          
          // Add to cart context
          addToCart(cartItem);
          
          // Close payment dialog
          setShowPaymentDialog(false);
          setSelectedBooking(null);
          
          // Redirect to checkout
          router.push('/checkout');
          return;
        }
        
        // For cash payment, process directly
        const response = await fetch(`http://localhost:3001/properties/bookings/${selectedBooking.id}/payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentMethod }),
        });

        if (!response.ok) {
          throw new Error('Failed to process payment');
        }

        const result = await response.json();
        console.log('Payment result:', result);
        
        toast.success('Payment processed successfully!');
        setShowPaymentDialog(false);
        setSelectedBooking(null);
        
        // Refresh bookings
        const refreshResponse = await fetch('http://localhost:3001/properties/my-bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (refreshResponse.ok) {
          const updatedBookings = await refreshResponse.json();
          setBookings(updatedBookings);
        }
        
      } catch (error) {
        toast.error('Payment failed. Please try again.');
        console.error('Payment error:', error);
      } finally {
        setProcessingPayment(false);
      }
    };

    const getStatusBadge = (status) => {
      switch (status) {
        case 'PENDING':
          return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
        case 'CONFIRMED':
          return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
        case 'REJECTED':
          return <Badge variant="destructive">Rejected</Badge>;
        case 'COMPLETED':
          return <Badge variant="outline" className="bg-blue-100 text-blue-800">Completed</Badge>;
        default:
          return <Badge variant="outline">{status}</Badge>;
      }
    };

    if (!user) return null;

    return (
      <div className="mt-12">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center tracking-tight drop-shadow">My Property Bookings</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Property Bookings Yet</h3>
            <p className="text-gray-600">You haven't made any property bookings yet.</p>
            <Button 
              className="mt-4"
              onClick={() => router.push('/property')}
            >
              Browse Properties
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{booking.property.title}</CardTitle>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span>{booking.property.address}, {booking.property.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendarAlt className="text-green-500" />
                      <span>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendarAlt className="text-purple-500" />
                      <span>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaDollarSign className="text-green-500" />
                      <span className="font-semibold">৳ {booking.totalPrice}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaUser className="text-orange-500" />
                      <span>Owner: {booking.property.owner?.name}</span>
                    </div>
                  </div>
                  
                  {booking.rejectionReason && (
                    <div className="text-sm text-red-600">
                      <strong>Rejection Reason:</strong> {booking.rejectionReason}
                    </div>
                  )}
                  
                  {booking.status === 'CONFIRMED' && booking.paymentStatus === 'PENDING' && (
                    <Button
                      onClick={() => handlePayment(booking)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <FaCreditCard className="mr-2" />
                      Proceed to Payment
                    </Button>
                  )}
                  
                  {booking.paymentStatus === 'PAID' && (
                    <div className="text-sm text-green-600 font-semibold">
                      ✅ Payment Completed
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Property:</span> {selectedBooking?.property.title}</p>
                  <p><span className="font-medium">Total Amount:</span> ৳{selectedBooking?.totalPrice}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Online Payment (Card/Bank Transfer)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={processPayment}
                  disabled={processingPayment}
                  className="flex-1"
                >
                  {processingPayment ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="mr-2" />
                      {paymentMethod === 'online' ? 'Proceed to Checkout' : 'Confirm Payment'}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentDialog(false)}
                  disabled={processingPayment}
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

  // In ProfilePage, after a role switch, force a refresh
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      // Listen for role changes and refresh the page
      const prevRole = window.__prevUserRole;
      if (prevRole && prevRole !== user.role) {
        router.refresh && router.refresh();
      }
      window.__prevUserRole = user.role;
    }
  }, [user?.role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">User data not found. Please log in again or contact support.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Enhanced Profile Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
          <div 
                className={`relative cursor-pointer group ${isEditing ? 'hover:opacity-80' : ''}`}
            onClick={handleAvatarClick}
          >
                <Avatar className="w-32 h-32 mb-4 ring-4 ring-white dark:ring-gray-800 shadow-lg">
              <AvatarImage src={formData.avatar} alt={formData.name} />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {formData.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
            </Avatar>
            {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">Change Photo</span>
              </div>
            )}
          </div>
          {isUploading && (
                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Uploading...
                </div>
          )}
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-foreground mb-2">{formData.name || 'Your Name'}</h1>
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                    {user?.role?.replace('_', ' ') || 'User'}
                  </Badge>
                  <Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-300">
                    Active
                  </Badge>
                </div>
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600 text-sm" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground font-medium">Email</p>
                    <p className="text-sm font-medium text-foreground">{formData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <FaPhone className="text-green-600 text-sm" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground font-medium">Phone</p>
                    <p className="text-sm font-medium text-foreground">{formData.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg md:col-span-2">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-purple-600 text-sm" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground font-medium">Address</p>
                    <p className="text-sm font-medium text-foreground">{formData.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
          <Button
            variant={isEditing ? "outline" : "default"}
                  className="min-w-[140px]"
            onClick={() => setIsEditing(!isEditing)}
          >
                  {isEditing ? (
                    <>
                      <FaTimes className="mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <FaUser className="mr-2" />
                      Edit Profile
                    </>
                  )}
          </Button>

                {/* Change Password Button and Modal */}
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="min-w-[140px]">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={passwordForm.current}
                          onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordForm.next}
                          onChange={e => setPasswordForm(f => ({ ...f, next: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordForm.confirm}
                          onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={passwordLoading}>
                        {passwordLoading ? 'Changing...' : 'Change Password'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Role Management Button and Modal */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="min-w-[140px]">
                      <FaUser className="mr-2" />
                      Role Management
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FaUser className="h-5 w-5" />
                        Role Management
                      </DialogTitle>
                    </DialogHeader>
                    {/* RoleSwitcher component */}
                    <RoleSwitcher />
                  </DialogContent>
                </Dialog>

                {saveStatus === 'saving' && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </div>
                )}
                
                {saveStatus === 'saved' && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <FaCheck />
                    Saved!
                  </div>
                )}
                
                {saveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <FaTimes />
                    Error saving
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form - Enhanced Design */}
          {isEditing && (
          <Card className="mb-8 shadow-lg border-0 bg-card">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
              <CardTitle className="text-2xl font-bold text-center text-foreground">
                <FaUser className="inline-block mr-2 text-blue-600" />
                Edit Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full Name *
                    </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="h-12"
            />
          </div>
                  
          <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
                      className="h-12 bg-muted"
            />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
                  
          <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number
                    </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
                      placeholder="+880 1XXX XXXXXX"
                      className="h-12"
            />
          </div>
                  
          <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-foreground">
                      Address
                    </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
                      placeholder="Enter your address"
                      className="h-12"
            />
          </div>
                </div>
                
                <div className="flex gap-3 pt-4">
            <Button
              type="submit"
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-2" />
                        Save Changes
                      </>
                    )}
            </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
        </form>
            </CardContent>
          </Card>
          )}

        {/* Interview Notifications Section */}
        <InterviewNotificationsSection notifications={notifications} />

        {/* Divider */}
        <div className="border-t border-gray-200 my-8" />

        {/* Exchange Offers Section */}
        <ExchangeOffersSection exchangeProducts={exchangeProducts} />

        {/* Swap Items Section */}
        <SwapItemsSection user={user} swapItems={swapItems} />

        {/* Divider */}
        <div className="border-t border-gray-200 my-8" />

        {/* Service Bookings & Approvals Section (for service providers) */}
        {user && user.role?.toLowerCase() === 'service_provider' && <ServiceProviderBookingsSection user={user} />}

        {/* Seller Bookings & Approvals Section */}
        {user && user.role?.toLowerCase() === 'seller' && <SellerBookingsSection user={user} />}

        {/* Landlord Bookings & Approvals Section */}
        {user && user.role?.toLowerCase() === 'landlord' && <LandlordBookingsSection user={user} />}

        {/* Tenant Bookings Section */}
        {user && user.role?.toLowerCase() === 'buyer' && <BuyerPurchasesSection user={user} />}
                    </div>
    </div>
  );
} 