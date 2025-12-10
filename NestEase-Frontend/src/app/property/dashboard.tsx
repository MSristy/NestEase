import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';
import { FaHome } from 'react-icons/fa';

interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  state: string;
  type: string;
  status: string;
  category?: string;
}

interface Booking {
  id: string;
  property?: Property;
  tenant?: { name: string; email: string };
  totalPrice: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  rejectionReason?: string;
}

interface Purchase {
  id: string;
  property?: Property;
  buyer?: { name: string; email: string };
  totalPrice: number;
  status: string;
  createdAt: string;
  rejectionReason?: string;
}

export default function PropertyDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('properties');
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Booking[]>([]);
  const [pendingPurchases, setPendingPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyCategoryFilter, setPropertyCategoryFilter] = useState<string | null>(null);
  
  // Modal state for rejection reason
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectType, setRejectType] = useState<'booking' | 'purchase' | null>(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  const propertyCategories = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' },
  ];

  useEffect(() => {
    if (!user) return;
    if (user.role === 'LANDLORD' || user.role === 'SELLER') {
      fetchMyProperties();
      fetchPendingRequests();
      fetchPendingPurchases();
    }
    if (user.role === 'TENANT' || user.role === 'BUYER') {
      fetchMyBookings();
    }
    setLoading(false);
  }, [user]);

  const fetchMyProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/properties/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch properties');
      setMyProperties(await response.json());
    } catch (e) {
      setMyProperties([]);
      console.error('Error fetching properties:', e);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/properties/my-bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      setMyBookings(await response.json());
    } catch (e) {
      setMyBookings([]);
      console.error('Error fetching bookings:', e);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/properties/pending-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch pending requests');
      setPendingRequests(await response.json());
    } catch (e) {
      setPendingRequests([]);
      console.error('Error fetching pending requests:', e);
    }
  };

  const fetchPendingPurchases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/properties/pending-purchases', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch pending purchases');
      setPendingPurchases(await response.json());
    } catch (e) {
      setPendingPurchases([]);
      console.error('Error fetching pending purchases:', e);
    }
  };

  const handleApproveBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/bookings/${bookingId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to approve booking');
      
      toast.success('Booking approved successfully!');
      fetchPendingRequests();
      fetchMyProperties();
    } catch (error) {
      toast.error('Failed to approve booking');
      console.error('Error approving booking:', error);
    }
  };

  const handleRejectBooking = async (bookingId: string, reason: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/bookings/${bookingId}/reject`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) throw new Error('Failed to reject booking');
      
      toast.success('Booking rejected successfully!');
      fetchPendingRequests();
    } catch (error) {
      toast.error('Failed to reject booking');
      console.error('Error rejecting booking:', error);
    }
  };

  const handleApprovePurchase = async (purchaseId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/purchases/${purchaseId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to approve purchase');
      
      toast.success('Purchase approved successfully!');
      fetchPendingPurchases();
      fetchMyProperties();
    } catch (error) {
      toast.error('Failed to approve purchase');
      console.error('Error approving purchase:', error);
    }
  };

  const handleRejectPurchase = async (purchaseId: string, reason: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/purchases/${purchaseId}/reject`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) throw new Error('Failed to reject purchase');
      
      toast.success('Purchase rejected successfully!');
      fetchPendingPurchases();
    } catch (error) {
      toast.error('Failed to reject purchase');
      console.error('Error rejecting purchase:', error);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setRejectLoading(true);
    try {
      if (rejectType === 'booking' && rejectId) {
        await handleRejectBooking(rejectId, rejectReason);
      } else if (rejectType === 'purchase' && rejectId) {
        await handleRejectPurchase(rejectId, rejectReason);
      }
      
      setShowRejectModal(false);
      setRejectReason('');
      setRejectId(null);
      setRejectType(null);
    } finally {
      setRejectLoading(false);
    }
  };

  if (!user) {
    return <div className="container mx-auto px-4 py-8 text-center">Please log in to view your dashboard.</div>;
  }

  const showPropertiesTab = user.role === 'LANDLORD' || user.role === 'SELLER';
  const showBookingsTab = user.role === 'TENANT' || user.role === 'BUYER';
  const showPendingRequestsTab = user.role === 'LANDLORD';
  const showPendingPurchasesTab = user.role === 'LANDLORD' || user.role === 'SELLER';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Property Dashboard</h1>
      <div className="flex gap-4 mb-6">
        {showPropertiesTab && (
          <button
            className={`px-4 py-2 rounded ${activeTab === 'properties' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('properties')}
          >
            My Properties
          </button>
        )}
        {showPendingPurchasesTab && (
          <button
            className={`px-4 py-2 rounded ${activeTab === 'pending-purchases' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveTab('pending-purchases');
              fetchPendingPurchases();
            }}
          >
            Pending Purchases ({pendingPurchases.length})
          </button>
        )}
        {showPendingRequestsTab && (
          <button
            className={`px-4 py-2 rounded ${activeTab === 'pending-requests' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveTab('pending-requests');
              fetchPendingRequests();
            }}
          >
            Pending Requests ({pendingRequests.length})
          </button>
        )}
        {showBookingsTab && (
          <button
            className={`px-4 py-2 rounded ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
        )}
      </div>
      
      {activeTab === 'properties' && showPropertiesTab && (
        <>
          <div className="flex gap-2 mb-6">
            {propertyCategories.map((cat) => (
              <button
                key={cat.value}
                className={`px-4 py-2 rounded-full border ${propertyCategoryFilter === cat.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                onClick={() => setPropertyCategoryFilter(propertyCategoryFilter === cat.value ? null : cat.value)}
              >
                {cat.label}
              </button>
            ))}
            {propertyCategoryFilter && (
              <button
                className="px-2 py-2 rounded-full border bg-gray-200 text-gray-700 border-gray-300"
                onClick={() => setPropertyCategoryFilter(null)}
              >
                Clear
              </button>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Properties</h2>
            {myProperties.length === 0 ? (
              <div>No properties found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProperties
                  .filter((property) =>
                    propertyCategoryFilter ? property.category === propertyCategoryFilter : true
                  )
                  .map((property) => (
                    <Card key={property.id} className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>{property.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2">Tk {property.price ? Number(property.price).toLocaleString() : 'N/A'}</div>
                        <div className="mb-2">{property.city}, {property.state}</div>
                        <div className="mb-2">Type: {property.type}</div>
                        <div className="mb-2">Status: {property.status}</div>
                        <Link href={`/property/${property.id}`}>
                          <Button className="w-full mt-2">View Details</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'pending-requests' && showPendingRequestsTab && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pending Booking Requests</h2>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pending requests found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-600">{request.property?.title || 'Property'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <strong>Tenant:</strong> {request.tenant?.name || request.tenant?.email || 'Unknown'}
                    </div>
                    <div className="mb-2">
                      <strong>Total Price:</strong> Tk {request.totalPrice}
                    </div>
                    <div className="mb-2">
                      <strong>Check-in:</strong> {new Date(request.checkInDate).toLocaleDateString()}
                    </div>
                    <div className="mb-2">
                      <strong>Check-out:</strong> {new Date(request.checkOutDate).toLocaleDateString()}
                    </div>
                    <div className="mb-2">
                      <strong>Status:</strong> 
                      <span className={`ml-1 px-2 py-1 rounded text-sm ${
                        request.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                        request.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    {request.rejectionReason && (
                      <div className="mb-2 text-red-600 text-sm">
                        <strong>Rejection Reason:</strong> {request.rejectionReason}
                      </div>
                    )}
                    {request.status === 'PENDING' && (
                      <div className="flex gap-2 mt-4">
                        <Button 
                          onClick={() => handleApproveBooking(request.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button 
                          onClick={() => {
                            setRejectId(request.id);
                            setRejectType('booking');
                            setShowRejectModal(true);
                          }}
                          variant="outline"
                          className="flex-1"
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
      )}

      {activeTab === 'bookings' && showBookingsTab && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
          {myBookings.length === 0 ? (
            <div>No bookings found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{booking.property?.title || 'Property'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">Tk {booking.totalPrice}</div>
                    <div className="mb-2">৳{booking.totalPrice}</div>
                    <div className="mb-2">{booking.property?.city}, {booking.property?.state}</div>
                    <div className="mb-2">Type: {booking.property?.type}</div>
                    <div className="mb-2">
                      Status: 
                      <span className={`ml-1 px-2 py-1 rounded text-sm ${
                        booking.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    {booking.rejectionReason && (
                      <div className="mb-2 text-red-600 text-sm">
                        <strong>Rejection Reason:</strong> {booking.rejectionReason}
                      </div>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <Button className="w-full mt-2 bg-green-600 hover:bg-green-700">
                        Proceed to Payment
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'pending-purchases' && showPendingPurchasesTab && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pending Purchase Requests</h2>
          {pendingPurchases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pending purchase requests found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingPurchases.map((purchase) => (
                <Card key={purchase.id} className="overflow-hidden border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-600">{purchase.property?.title || 'Property'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <strong>Buyer:</strong> {purchase.buyer?.name || purchase.buyer?.email || 'Unknown'}
                    </div>
                    <div className="mb-2">
                      <strong>Total Price:</strong> ৳{purchase.totalPrice}
                    </div>
                    <div className="mb-2">
                      <strong>Status:</strong>
                      <span className={`ml-1 px-2 py-1 rounded text-sm ${
                        purchase.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                        purchase.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        purchase.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {purchase.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong>Requested At:</strong> {new Date(purchase.createdAt).toLocaleDateString()}
                    </div>
                    {purchase.rejectionReason && (
                      <div className="mb-2 text-red-600 text-sm">
                        <strong>Rejection Reason:</strong> {purchase.rejectionReason}
                      </div>
                    )}
                    {purchase.status === 'PENDING' && (
                      <div className="flex gap-2 mt-4">
                        <Button 
                          onClick={() => handleApprovePurchase(purchase.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button 
                          onClick={() => {
                            setRejectId(purchase.id);
                            setRejectType('purchase');
                            setShowRejectModal(true);
                          }}
                          variant="outline"
                          className="flex-1"
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
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">Rejection Reason</h2>
            <Input
              className="w-full mb-4"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleRejectSubmit}
                disabled={rejectLoading}
                className="flex-1"
              >
                {rejectLoading ? 'Submitting...' : 'Submit'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setRejectId(null);
                  setRejectType(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {user && <MyRequestsSection user={user} />}
    </div>
  );
}

function MyRequestsSection({ user }: { user: any }) {
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch('${process.env.NEXT_PUBLIC_API_URL}/properties/my-bookings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setMyRequests(Array.isArray(data) ? data : data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700 text-center tracking-tight drop-shadow">
        My Requests (Bookings & Purchases)
      </h2>
      <div className="rounded-xl shadow p-6 mb-8 bg-inherit">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : myRequests.length === 0 ? (
          <p className="text-gray-500 text-center">No requests yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myRequests.map((req) => (
              <Card key={req.bookingId || req.purchaseId || req.id} className="mb-2">
                <CardHeader>
                  <CardTitle>{req.title || req.property?.title || 'Property'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-700 text-sm mb-1">
                    Status: 
                    <span className={`ml-1 px-2 py-1 rounded text-sm ${
                      req.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                      req.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  {req.rejectionReason && (
                    <div className="text-sm text-red-600">
                      <strong>Rejected:</strong> {req.rejectionReason}
                    </div>
                  )}
                  {req.status === 'CONFIRMED' && (
                    <Button
                      onClick={() => {
                        alert('Proceed to payment for ' + (req.title || req.property?.title));
                      }}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Proceed to Payment
                    </Button>
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

const renderPropertyCard = (recommendation: any) => {
  const property = recommendation.property;
  if (!property) return null;

  const score = recommendation.score ?? 0;
  const reasons = recommendation.reasons ?? [];

  return (
    <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {property.images && property.images.length > 0 ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${property.images[0]}`}
            alt={property.title || 'Property'}
            className="w-full h-48 object-cover"
            onError={(e) => { e.currentTarget.src = '/images/placeholder.jpg'; }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
          Score: {score.toFixed(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {property.title || `${property.bedrooms || 'N/A'} Bed ${property.type || 'Property'}`}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {property.address || 'Address not available'}
        </p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-blue-600">
            Tk {property.price ? Number(property.price).toLocaleString() : 'N/A'}
          </span>
          <span className="text-sm text-gray-500">
            {property.bedrooms || 'N/A'} bed • {property.bathrooms || 'N/A'} bath
          </span>
        </div>
        {reasons.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">Why recommended:</p>
            <div className="flex flex-wrap gap-1">
              {reasons.slice(0, 2).map((reason: string, index: number) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        )}
        <Link
          href={`/property/${property.id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}; 
