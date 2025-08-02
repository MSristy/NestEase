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
  'All',
  'Apartment',
  'House', 
  'Villa',
  'Studio',
  'Condo'
];

const PROPERTY_ICONS: { [key: string]: React.ElementType } = {
  'All': FaEllipsisH,
  'Apartment': FaBuilding,
  'House': FaHome,
  'Villa': FaCrown,
  'Studio': FaDoorOpen,
  'Condo': FaHouseUser,
};

export default function PropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Studio'];
  const propertyCategories = [
    'All',
    'apartment',
    'house',
    'villa',
    'studio',
  ];

  useEffect(() => {
    fetchProperties();
    // Load cart items from localStorage
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCartItems);
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
      const response = await fetch(url, {
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

    const matchesType = !selectedType || selectedType === 'All' || property.category === selectedType;
    const matchesCategory = categoryFilter === 'All' || property.category === categoryFilter;

    return matchesSearch && matchesPrice && matchesType && matchesCategory;
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
      {/* Beautiful Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Find Your Perfect Home
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Discover amazing properties for rent and sale in your preferred location.
        </p>
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
                onClick={() => setCategoryFilter(category === categoryFilter ? 'All' : category)}
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
                <span className="text-sm font-medium text-center">{category}</span>
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
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Your Cart ({cartItems.length} items)</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex space-x-4">
                    {item.images && (
                      <div className="relative h-24 w-24">
                        <Image
                          src={item.images}
                          alt={item.product_name || item.title}
                          fill
                          className="object-cover rounded-lg"
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
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-lg font-semibold">
                Total: ৳{cartItems.reduce((sum, item) => sum + item.price, 0)}
              </div>
              <Link href="/checkout">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search properties by location, type, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <FaFilter /> Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative h-48">
                <Image
                  src={property.images && property.images.length > 0 
                    ? `http://localhost:3001${property.images[0]}` 
                    : '/placeholder-property.jpg'}
                  alt={property.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-property.jpg';
                  }}
                />
                <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                  <FaHeart className="text-gray-400 hover:text-red-500 cursor-pointer" />
                </div>
                {property.isVerified && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    Verified
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
                  <span className="text-lg font-bold text-blue-600">৳{property.price.toLocaleString()}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <FaBed />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaBath />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaHome />
                    <span>{property.squareFeet} sq ft</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <FaMapMarkerAlt />
                  <span>{property.location}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedPropertyId(property.id)}
                  >
                    View Details
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      const newItem = {
                        id: property.id,
                        title: property.title,
                        price: property.price,
                        images: property.images && property.images.length > 0 
                          ? `http://localhost:3001${property.images[0]}` 
                          : '/placeholder-property.jpg',
                        location: property.location,
                        owner: property.owner,
                        type: 'property'
                      };
                      const updatedCart = [...cartItems, newItem];
                      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
                      setCartItems(updatedCart);
                      toast.success('Property added to cart!');
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations Section */}
      <RecommendationsSection />

      {/* Property Details Modal */}
      {selectedPropertyId && (
        <PropertyDetailsModal
          propertyId={selectedPropertyId}
          onClose={() => setSelectedPropertyId(null)}
        />
      )}
    </div>
  );
} 