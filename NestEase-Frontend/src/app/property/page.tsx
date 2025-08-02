'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaBath, FaBed, FaHome, FaSearch, FaFilter, FaPlus, FaBuilding, FaHouseUser, FaCrown, FaDoorOpen, FaEllipsisH } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import PropertyDetailsModal from './PropertyDetailsModal';
import RecommendationsSection from '@/components/RecommendationsSection';
import { getImageUrl, handleImageError, apiFetch } from '@/lib/utils';
import ioClient from 'socket.io-client';
import { useNotifications } from '@/context/NotificationContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { NotificationProvider } from '@/context/NotificationContext';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  type: string;
  amenities: string[];
  images: string[];
  status: string;
  isVerified: boolean;
  bachelorFriendly: boolean;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  category: string;
}

const PROPERTY_CATEGORIES = [
  'all',
  'apartment',
  'house',
  'villa',
  'studio',
  'condo'
];

const propertyCategories = PROPERTY_CATEGORIES;

const PROPERTY_ICONS: { [key: string]: React.ElementType } = {
  'all': FaEllipsisH,
  'apartment': FaBuilding,
  'house': FaHome,
  'villa': FaCrown,
  'studio': FaDoorOpen,
  'condo': FaHouseUser,
};

export default function PropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  useEffect(() => {
    fetchProperties();
    // Load cart items from localStorage
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCartItems);

    if (user && user.id) {
      const socket = ioClient('http://localhost:3001', {
        query: { userId: user.id },
        transports: ['websocket'],
      });
      socket.on('notification', (notification: any) => {
        // Notification updates handled by NotificationContext
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:3001/properties';
      // Filter by user role
      if (user) {
        if (user.role === 'TENANT') {
          url += '?type=RENT&status=AVAILABLE';
        } else if (user.role === 'BUYER') {
          url += '?type=SALE&status=AVAILABLE';
        } else {
          url += '?status=AVAILABLE';
        }
      } else {
        url += '?status=AVAILABLE';
      }
      const response = await apiFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error details:', error);
      toast.error('Failed to fetch properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const query = searchQuery.toLowerCase();
    const isNumericQuery = !isNaN(Number(searchQuery)) && searchQuery.trim() !== '';
    const matchesSearch =
      (property.title?.toLowerCase() || '').includes(query) ||
      (property.location?.toLowerCase() || '').includes(query) ||
      (property.city?.toLowerCase() || '').includes(query) ||
      (property.state?.toLowerCase() || '').includes(query) ||
      (property.address?.toLowerCase() || '').includes(query) ||
      (property.description?.toLowerCase() || '').includes(query) ||
      (property.category?.toLowerCase() || '').includes(query) ||
      (property.owner?.name?.toLowerCase() || '').includes(query) ||
      (property.owner?.email?.toLowerCase() || '').includes(query) ||
      (isNumericQuery && (
        property.price === Number(searchQuery) ||
        property.bedrooms === Number(searchQuery) ||
        property.bathrooms === Number(searchQuery) ||
        property.squareFeet === Number(searchQuery)
      ));

    const matchesPrice = (!priceRange.min || property.price >= Number(priceRange.min)) &&
      (!priceRange.max || property.price <= Number(priceRange.max));

    const matchesType = selectedType === 'all' || !selectedType || property.category?.toLowerCase() === selectedType;
    const matchesCategory = categoryFilter === 'all' || !categoryFilter || property.category?.toLowerCase() === categoryFilter;

    return matchesSearch && matchesPrice && matchesType && matchesCategory;
  });

  // Sort bachelor-friendly properties first
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (a.bachelorFriendly && !b.bachelorFriendly) return -1;
    if (!a.bachelorFriendly && b.bachelorFriendly) return 1;
    return 0;
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
      {/* Title Section - larger, centered with background */}
      <div className="text-center mb-12 py-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Find Your Best Properties</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">Find your perfect home for rent or sale</p>
      </div>

      {/* Property Category Rectangles */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Browse by Property Type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {PROPERTY_CATEGORIES.map((category) => {
            const Icon = PROPERTY_ICONS[category] || FaEllipsisH;
            return (
              <div
                key={category}
                onClick={() => setCategoryFilter(category === categoryFilter ? 'all' : category)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300 border-2
                  ${categoryFilter === category 
                    ? 'bg-blue-600 text-white shadow-lg scale-105 border-blue-600' 
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
              >
                <div className={`p-3 rounded-lg mb-2 ${
                  categoryFilter === category 
                    ? 'bg-white text-blue-600' 
                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Properties</h1>
        <div className="flex gap-2">
          <Link href="/property/dashboard">
            <Button variant="outline">My Dashboard</Button>
          </Link>
          {user ? (
            <Link href="/property/create">
              <Button className="flex items-center gap-2">
                <FaPlus /> List Property
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button className="flex items-center gap-2">
                <FaPlus /> List Property
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Cart Section */}
      {cartItems.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Cart ({cartItems.length} items)</h3>
          <div className="space-y-3">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <div className="flex items-center space-x-3">
                  {item.images && item.images.length > 0 && (
                    <div className="w-12 h-12 relative rounded overflow-hidden">
                      <img
                        src={getImageUrl(item.images[0])}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{item.product_name || item.title}</h3>
                      <p className="text-sm text-gray-600">By {item.owner_name || item.owner?.name}</p>
                      <p className="text-sm text-gray-600">Location: {item.location}</p>
                      <div className="flex items-center">
                        <span className="text-xl font-bold">৳{item.price}</span>
                        {item.discount > 0 && (
                          <span className="ml-2 text-sm text-green-600">
                            {item.discount}% off
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const updatedCart = cartItems.filter(cartItem => cartItem.id !== item.id);
                      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
                      setCartItems(updatedCart);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Remove
                  </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <Input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={selectedType}
          onValueChange={setSelectedType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Property Category" />
          </SelectTrigger>
          <SelectContent>
            {propertyCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Min Price"
          value={priceRange.min}
          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Max Price"
          value={priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
        />
      </div>

      <PropertyDetailsModal
        propertyId={selectedPropertyId}
        open={!!selectedPropertyId}
        onClose={() => setSelectedPropertyId(null)}
      />

      {loading ? (
        <div className="text-center py-8">Loading properties...</div>
      ) : sortedProperties.length === 0 ? (
        <div className="text-center py-8">No properties found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden relative">
              <div className="relative h-48 w-full">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={(() => {
                      const imageUrl = getImageUrl(property.images[0]);
                      console.log('Property image URL:', {
                        original: property.images[0],
                        constructed: imageUrl,
                        propertyId: property.id
                      });
                      return imageUrl;
                    })()}
                  alt={property.title}
                    className="w-full h-full object-cover"
                  onError={(e) => {
                      console.error('Image failed to load:', property.images?.[0]);
                      handleImageError(e, '/images/placeholder.jpg');
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', property.images?.[0]);
                    }}
                  />
                ) : (
                  <img
                    src="/images/placeholder.jpg"
                    alt="Placeholder"
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Bachelor-Friendly Badge */}
                {property.bachelorFriendly && (
                  <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                    Bachelor-Friendly
                  </div>
                )}
                {property.isVerified && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    Verified
                  </div>
                )}
              </div>
              
              {/* Property Type and Category badges - top right of card below image */}
              <div className="absolute top-48 right-4 flex flex-col gap-1 z-10">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold capitalize shadow">
                      {property.type}
                    </span>
                    {property.category && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize shadow">
                        {property.category}
                      </span>
                    )}
                  </div>
              
              <CardContent className="p-4">
                {/* Property Title with descriptive format */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {property.bedrooms} Bed {property.type}
                </h3>
                
                {/* Owner Name */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  By {property.owner?.name || 'Owner'}
                </p>
                
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {property.type === 'SALE'
                    ? `৳${property.price.toLocaleString()}`
                    : `৳${property.price.toLocaleString()}/month`}
                </p>
                <div className="flex items-center text-gray-600 mb-2">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{property.location}, {property.city}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FaBed className="mr-1" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="mr-1" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <FaHome className="mr-1" />
                    <span>{property.squareFeet} sq ft</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(property.amenities || []).slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                  {property.amenities && property.amenities.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                      +{property.amenities.length - 3} more
                    </span>
                  )}
                </div>
                {user ? (
                  <Button className="w-full mt-4" onClick={() => setSelectedPropertyId(property.id)}>
                    View Details
                  </Button>
                ) : (
                  <Link href="/auth/login">
                    <Button className="w-full mt-4">View Details</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* AI-Powered Recommendations */}
      <RecommendationsSection 
        title="Recommended for You" 
        type="personalized" 
        limit={6} 
      />

      {/* Trending Properties */}
      <RecommendationsSection 
        title="Trending Properties" 
        type="trending" 
        limit={6} 
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>
            Notifications
            <button onClick={markAllAsRead} className="ml-2 text-xs text-blue-600 underline">Mark all as read</button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-[300px] overflow-y-auto">
            {Array.isArray(notifications) && notifications.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">No notifications</div>
            ) : (
              Array.isArray(notifications) &&
              notifications.map((n: any, i: number) => (
                <DropdownMenuItem key={i} className={`flex flex-col items-start gap-1 py-3 ${!n.read ? 'bg-blue-50' : ''}`}>
                  <span className="font-medium">{n.message}</span>
                  <span className="text-xs text-muted-foreground">{new Date(n.createdAt || '').toLocaleString()}</span>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}