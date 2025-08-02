'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSpinner, FaStar, FaSearch, FaHeart, FaRegHeart, FaFilter, FaHistory, FaBroom, FaHardHat, FaPaintRoller, FaPlug, FaSeedling, FaShippingFast, FaToolbox, FaWrench, FaShieldAlt, FaEllipsisH, FaCreditCard, FaMoneyBillWave, FaFileContract, FaUserCheck, FaHome, FaTools, FaExchangeAlt, FaBan, FaExclamationTriangle, FaEnvelope, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { Role } from '@/types/role.enum';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface Service {
  id: number;
  businessName: string;
  description: string;
  serviceType: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  services: string;
  images: string[];
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  totalRatings: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  isFavorite?: boolean;
}

interface Booking {
  id: number;
  service: Service;
  date: string;
  time: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  address: string;
  notes: string;
  duration?: number;
  totalAmount?: number;
  paymentStatus?: 'pending' | 'paid' | 'cancelled';
  paymentMethod?: 'cash' | 'online' | 'pending';
  billId?: string;
}

const SERVICE_CATEGORIES = [
  'Cleaning',
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Gardening',
  'Moving',
  'Security',
  'Maintenance',
  'Other'
];

const SERVICE_ICONS: { [key: string]: React.ElementType } = {
  Cleaning: FaBroom,
  Plumbing: FaWrench,
  Electrical: FaPlug,
  Carpentry: FaToolbox,
  Painting: FaPaintRoller,
  Gardening: FaSeedling,
  Moving: FaShippingFast,
  Security: FaShieldAlt,
  Maintenance: FaHardHat,
  Other: FaEllipsisH,
};

export default function ServicesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: [] as string[],
    priceRange: [0, 1000],
    duration: [0, 240],
    minRating: 0,
  });
  const [serviceHistory, setServiceHistory] = useState<Service[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [bookingDuration, setBookingDuration] = useState('1');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);

  useEffect(() => {
    fetchServices();
    if (user) {
      fetchBookings();
      fetchFavorites();
      fetchServiceHistory();
      if (user.role === Role.SERVICE_PROVIDER) {
        checkServiceProviderProfile();
      }
    }
  }, [user]);

  // Calculate estimated price when duration changes
  useEffect(() => {
    if (selectedService) {
      const basePrice = getBasePrice(selectedService.serviceType);
      const duration = parseInt(bookingDuration) || 1;
      setEstimatedPrice(basePrice * duration);
    }
  }, [selectedService, bookingDuration]);

  const getBasePrice = (serviceType: string): number => {
    const priceMap: { [key: string]: number } = {
      'TV Repair': 800,
      'AC Repair': 1200,
      'Cleaning': 500,
      'Plumbing': 800,
      'Electrical': 1000,
      'Carpentry': 700,
      'Painting': 600,
      'Gardening': 500,
      'Moving': 1500,
      'Security': 1200,
      'Maintenance': 800,
      'Other': 600
    };
    
    return priceMap[serviceType] || 600;
  };

  const checkServiceProviderProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!user) return;
      
      const response = await fetch(`http://localhost:3001/service-providers/profile/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      setHasProfile(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:3001/service-providers', {
        // Remove Authorization header to make it public
      });

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      toast.error('Failed to load services');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/service-providers/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      // Update services with favorite status
      setServices(prevServices => 
        prevServices.map(service => ({
        ...service,
          isFavorite: data.some((fav: any) => fav.serviceId === service.id)
        }))
      );
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchServiceHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/service-providers/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch service history');
      }

      const data = await response.json();
      setServiceHistory(data);
    } catch (error) {
      console.error('Error fetching service history:', error);
    }
  };

  const handleToggleFavorite = async (serviceId: number) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3001/service-providers/${serviceId}/favorite`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      // Update local state
      setServices(prevServices => 
        prevServices.map(service => 
        service.id === serviceId 
          ? { ...service, isFavorite: !service.isFavorite }
          : service
        )
      );

      toast.success('Favorite updated successfully');
    } catch (error) {
      toast.error('Failed to update favorite');
      console.error('Error toggling favorite:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/service-providers/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      console.log('Fetched bookings:', data); // Debug log
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error('Error fetching bookings:', error);
    }
  };

  const handleBookService = async () => {
    if (!selectedService) {
      toast.error('No service selected');
      return;
    }

    // Check if user is a service provider
    if (user?.role === Role.SERVICE_PROVIDER) {
      toast.error('Service providers cannot book services. Please use a regular user account.');
      return;
    }

    // Enhanced validation
    const errors = [];
    if (!bookingDate) errors.push('Date is required');
    if (!bookingTime) errors.push('Time is required');
    if (!address.trim()) errors.push('Address is required');
    if (!bookingDuration) errors.push('Duration is required');

    if (errors.length > 0) {
      toast.error(`Please fix the following errors: ${errors.join(', ')}`);
      return;
    }

    // Validate date is not in the past
    const selectedDateTime = new Date(`${bookingDate}T${bookingTime}`);
    const now = new Date();
    if (selectedDateTime <= now) {
      toast.error('Please select a future date and time');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please log in to book services');
        return;
      }

      const bookingData = {
        serviceType: selectedService.serviceType,
        serviceDate: bookingDate,
        serviceTime: bookingTime,
        duration: parseInt(bookingDuration),
        requestedServices: [selectedService.businessName],
        description: notes,
        address: address.trim(),
      };

      const response = await fetch(`http://localhost:3001/service-providers/${selectedService.id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'This time slot is unavailable.');
        }
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      
      toast.success(result.message || 'Service booking request submitted successfully!', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
          color: '#fff',
          border: '1px solid #38bdf8',
          boxShadow: '0 4px 24px 0 rgba(56,189,248,0.15)',
        },
        className: 'dark:bg-slate-800 dark:text-white dark:border-cyan-400',
      });
      
      // Reset form
      setSelectedService(null);
      setBookingDate('');
      setBookingTime('');
      setAddress('');
      setNotes('');
      setBookingDuration('1');
      
      // Refresh bookings and switch to bookings tab
      fetchBookings();
      setActiveTab('bookings');
      
      setTimeout(() => {
        toast.success('Check your bookings tab to see your booking status and payment options!', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
            color: '#fff',
            border: '1px solid #38bdf8',
            boxShadow: '0 4px 24px 0 rgba(56,189,248,0.15)',
          },
          className: 'dark:bg-slate-800 dark:text-white dark:border-cyan-400',
        });
      }, 1000);
    } catch (error) {
      console.error('Error booking service:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to book service');
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3001/service-providers/bookings/${bookingId}/cancel`, {
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
    }
  };

  const handlePayment = async (bookingId: number, paymentMethod: 'cash' | 'online') => {
    try {
      const token = localStorage.getItem('token');
      
      if (paymentMethod === 'online') {
        // For online payment, add to cart and redirect to checkout
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
          // Add service to global cart
          const cartItem = {
            id: bookingId,
            type: 'service' as const,
            name: `${booking.service.businessName} - ${booking.service.serviceType}`,
            price: booking.totalAmount || 0,
            quantity: 1,
            image: booking.service.images?.[0] || '/images/placeholder.jpg',
            serviceBooking: booking
          };
          
          // Add to cart context
          addToCart(cartItem);
          
          // Close payment dialog
          setShowPaymentDialog(false);
          setSelectedBookingForPayment(null);
          
          // Redirect to checkout
          router.push('/checkout');
          return;
        }
      }
      
      // For cash payment, process directly
      const response = await fetch(`http://localhost:3001/service-providers/bookings/${bookingId}/payment`, {
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
      console.log('Payment result:', result); // Debug log
      
      if (paymentMethod === 'cash') {
        toast.success('Cash payment confirmed. Please pay the provider on service completion.', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
            color: '#fff',
            border: '1px solid #38bdf8',
            boxShadow: '0 4px 24px 0 rgba(56,189,248,0.15)',
          },
          className: 'dark:bg-slate-800 dark:text-white dark:border-cyan-400',
        });
      }
      
      // Close payment dialog
      setShowPaymentDialog(false);
      setSelectedBookingForPayment(null);
      
      fetchBookings();
    } catch (error) {
      toast.error('Failed to process payment');
      console.error('Error processing payment:', error);
    }
  };

  const handleCompleteService = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3001/service-providers/bookings/${bookingId}/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to complete service');
      }

      toast.success('Service marked as completed', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
          color: '#fff',
          border: '1px solid #38bdf8',
          boxShadow: '0 4px 24px 0 rgba(56,189,248,0.15)',
        },
        className: 'dark:bg-slate-800 dark:text-white dark:border-cyan-400',
      });
      fetchBookings();
    } catch (error) {
      toast.error('Failed to complete service');
      console.error('Error completing service:', error);
    }
  };

  const filteredServices = services.filter((service) => {
    if (categoryFilter !== 'all' && service.serviceType !== categoryFilter) return false;
    if (searchQuery && !service.businessName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !service.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.category.length > 0 && !filters.category.includes(service.serviceType)) return false;
    if (service.rating < filters.minRating) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBookingStep = (booking: Booking) => {
    if (booking.status === 'pending_approval') return 1;
    if (booking.status === 'approved' && booking.paymentStatus === 'pending') return 2;
    if (booking.status === 'approved' && booking.paymentStatus === 'paid') return 3;
    if (booking.status === 'completed') return 4;
    return 0;
  };

  if (user && user.role === Role.SERVICE_PROVIDER && !hasProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Complete Your Service Provider Profile
                </CardTitle>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">
                    To start offering services on NestEase, you need to complete your business profile first.
                  </p>
                  <Button 
                    onClick={() => router.push('/service-provider-profile')}
                    className="w-full"
                  >
                    Complete Profile Now
                  </Button>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
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
      {/* Main Heading Section - matching property page style */}
      <div className="text-center mb-12 py-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Available Services</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">Find and book professional services in your area</p>
      </div>

      {/* Category Circles */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6 [color:rgb(17,24,39)] dark:[color:white]">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {SERVICE_CATEGORIES.map((category) => {
            const Icon = SERVICE_ICONS[category] || FaEllipsisH;
            return (
              <div
                key={category}
                onClick={() => setCategoryFilter(category === categoryFilter ? 'all' : category)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300
                  ${categoryFilter === category ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <div className={`p-3 rounded-full mb-2 ${categoryFilter === category ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{category}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[300px]"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FaFilter /> Filters
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="services">Available Services</TabsTrigger>
          {user && (
            <>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </>
          )}
        </TabsList>
      </Tabs>

      {activeTab === 'services' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={service.images && service.images.length > 0 
                      ? `http://localhost:3001${service.images[0]}` 
                      : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'}
                    alt={service.businessName}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => handleToggleFavorite(service.id)}
                  >
                    {service.isFavorite ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-500" />
                    )}
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{service.businessName}</h3>
                    <p className="text-gray-600 mb-2">{service.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {service.serviceType}
                      </span>
                      {service.isVerified && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{service.city}, {service.state}</span>
                      <FaStar className="ml-4 mr-1 text-yellow-400" />
                      <span>{service.rating} ({service.totalReviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <p>📞 {service.phone}</p>
                      <p>📍 {service.address}</p>
                    </div>
                    <div className="flex gap-2">
                      {user?.role === Role.SERVICE_PROVIDER ? (
                        <Button
                          variant="outline"
                          disabled
                          className="cursor-not-allowed"
                          title="Service providers cannot book services"
                        >
                          Not Available
                        </Button>
                      ) : !user ? (
                        <Button
                          onClick={() => router.push('/auth/login')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Login to Book
                        </Button>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              onClick={() => setSelectedService(service)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Book Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Book {service.businessName}</DialogTitle>
                              <DialogDescription>
                                Fill out the form below to book this service. Your request will be sent to the service provider for approval.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Service Type */}
                              <div className="space-y-2">
                                <Label>Service Type</Label>
                                <Input
                                  value={selectedService?.serviceType || ''}
                                  disabled
                                  className="bg-gray-50"
                                />
                              </div>

                              {/* Date and Time */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="flex items-center gap-1">
                                    Date <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    type="date"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="flex items-center gap-1">
                                    Time <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    type="time"
                                    value={bookingTime}
                                    onChange={(e) => setBookingTime(e.target.value)}
                                  />
                                </div>
                              </div>

                              {/* Duration */}
                              <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                  Duration (hours) <span className="text-red-500">*</span>
                                </Label>
                                <Select value={bookingDuration} onValueChange={setBookingDuration}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1 hour</SelectItem>
                                    <SelectItem value="2">2 hours</SelectItem>
                                    <SelectItem value="3">3 hours</SelectItem>
                                    <SelectItem value="4">4 hours</SelectItem>
                                    <SelectItem value="5">5 hours</SelectItem>
                                    <SelectItem value="6">6 hours</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="text-sm text-gray-600">
                                  Base price: ৳{getBasePrice(selectedService?.serviceType || '')}/hour
                                </div>
                              </div>

                              {/* Pricing Display */}
                              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pricing Summary</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">Service Type:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{selectedService?.serviceType || ''}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">Duration:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{bookingDuration} hour(s)</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">Rate:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">৳{getBasePrice(selectedService?.serviceType || '')}/hour</span>
                                  </div>
                                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                                    <span className="text-gray-900 dark:text-white">Estimated Total:</span>
                                    <span className="text-blue-600 dark:text-blue-400">৳{estimatedPrice}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Address */}
                              <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                  Service Address <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                  value={address}
                                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.target.value)}
                                  placeholder="Enter the address where you need the service"
                                  rows={3}
                                />
                              </div>

                              {/* Additional Notes */}
                              <div className="space-y-2">
                                <Label>Additional Notes</Label>
                                <Textarea
                                  value={notes}
                                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                                  placeholder="Any special instructions or requirements"
                                  rows={3}
                                />
                              </div>

                              {/* Confirm Button */}
                              <Button
                                onClick={handleBookService}
                                disabled={!bookingDate || !bookingTime || !address.trim() || !bookingDuration || user?.role === Role.SERVICE_PROVIDER}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                              >
                                Confirm Booking Request
                              </Button>

                              {/* Form Validation Info */}
                              <div className="text-xs text-gray-500 text-center space-y-1">
                                <p>* Required fields. Your booking will be reviewed by the service provider.</p>
                                <p>You will receive a confirmation once the provider approves your request.</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : activeTab === 'bookings' ? (
        <div className="grid grid-cols-1 gap-6">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
                      <Image
                        src={booking.service.images && booking.service.images.length > 0 
                          ? `http://localhost:3001${booking.service.images[0]}` 
                          : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'}
                        alt={booking.service.businessName}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>

                    <div className="md:col-span-3 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{booking.service.businessName}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <FaMapMarkerAlt className="mr-2" />
                            <span>{booking.address}</span>
                          </div>
                        </div>
                        <div className={`font-semibold px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Date</div>
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-600" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Time</div>
                          <div className="flex items-center">
                            <FaClock className="mr-2 text-gray-600" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                        {booking.duration && (
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Duration</div>
                            <div className="flex items-center">
                              <FaClock className="mr-2 text-gray-600" />
                              <span>{booking.duration} hour(s)</span>
                            </div>
                          </div>
                        )}
                        {booking.totalAmount && (
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                            <div className="flex items-center font-semibold text-green-600">
                              <span>৳{booking.totalAmount}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Payment Status */}
                      {booking.paymentStatus && (
                        <div className="pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Payment Status</div>
                              <div className={`font-semibold px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                              </div>
                            </div>
                            {booking.paymentMethod && booking.paymentMethod !== 'pending' && (
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Payment Method</div>
                                <div className="font-semibold text-blue-600">
                                  {booking.paymentMethod.charAt(0).toUpperCase() + booking.paymentMethod.slice(1)}
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Debug info - remove later */}
                          <div className="text-xs text-gray-400 mt-2">
                            Debug: PaymentMethod = "{booking.paymentMethod}", PaymentStatus = "{booking.paymentStatus}"
                          </div>
                        </div>
                      )}

                      {/* Booking Progress Indicator */}
                      <div className="pt-4 border-t">
                        <div className="text-sm text-gray-500 mb-3">Booking Progress</div>
                        <div className="flex items-center space-x-2">
                          <div className={`flex-1 h-2 rounded-full ${getBookingStep(booking) >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                            getBookingStep(booking) >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            1
                          </div>
                          <div className={`flex-1 h-2 rounded-full ${getBookingStep(booking) >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                            getBookingStep(booking) >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            2
                          </div>
                          <div className={`flex-1 h-2 rounded-full ${getBookingStep(booking) >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                            getBookingStep(booking) >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            3
                          </div>
                          <div className={`flex-1 h-2 rounded-full ${getBookingStep(booking) >= 4 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                            getBookingStep(booking) >= 4 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            4
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Requested</span>
                          <span>Approved</span>
                          <span>Paid</span>
                          <span>Completed</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 border-t">
                        <div className="flex gap-2">
                          {booking.status === 'approved' && booking.paymentStatus === 'pending' && (
                            <Button
                              onClick={() => {
                                setSelectedBookingForPayment(booking);
                                setShowPaymentDialog(true);
                              }}
                              className="flex-1"
                            >
                              <FaCreditCard className="mr-2" />
                              Pay Now
                            </Button>
                          )}
                          {booking.status === 'pending_approval' && (
                            <Button
                              variant="outline"
                              onClick={() => handleCancelBooking(booking.id)}
                              className="flex-1"
                            >
                              <FaBan className="mr-2" />
                              Cancel
                            </Button>
                          )}
                          {booking.status === 'approved' && booking.paymentStatus === 'paid' && (
                            <Button
                              onClick={() => handleCompleteService(booking.id)}
                              className="flex-1"
                            >
                              <FaCheck className="mr-2" />
                              Mark Complete
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
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings found</p>
            </div>
          )}
        </div>
      ) : activeTab === 'favorites' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter(service => service.isFavorite).map((service) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={service.images && service.images.length > 0 
                      ? `http://localhost:3001${service.images[0]}` 
                      : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'}
                    alt={service.businessName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{service.businessName}</h3>
                  <p className="text-gray-600 mb-2">{service.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{service.city}, {service.state}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : activeTab === 'history' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceHistory.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={service.images && service.images.length > 0 
                      ? `http://localhost:3001${service.images[0]}` 
                      : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'}
                    alt={service.businessName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{service.businessName}</h3>
                  <p className="text-gray-600 mb-2">{service.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{service.city}, {service.state}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Payment Method</DialogTitle>
            <DialogDescription>
              Select your preferred payment method for this booking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">
                Total Amount: ৳{selectedBookingForPayment?.totalAmount?.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handlePayment(selectedBookingForPayment!.id, 'cash')}
              >
                <FaMoneyBillWave className="mr-2" />
                Pay with Cash
              </Button>
              <Button 
                className="flex-1"
                onClick={() => handlePayment(selectedBookingForPayment!.id, 'online')}
              >
                <FaCreditCard className="mr-2" />
                Pay Online
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}