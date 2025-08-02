'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FaMapMarkerAlt, FaBath, FaBed, FaHome, FaCheck, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
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
  isVerified: boolean;
  yourName: string;
  yourPhone: string;
  yourEmail: string;
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  status: string;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch property details');
      }

      const data = await response.json();
      setProperty(data);
    } catch (error) {
      toast.error('Failed to fetch property details');
      console.error('Error fetching property details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Property not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="relative h-96 w-full mb-6">
                <Image
                  src={property.images && property.images.length > 0 
                    ? `http://localhost:3001${property.images[selectedImage]}`
                    : '/placeholder-property.jpg'}
                  alt={property.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  style={{ objectFit: 'cover' }}
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-property.jpg';
                  }}
                />
                {property.isVerified && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    Verified Property
                  </div>
                )}
              </div>
              {property.images && property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {property.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative h-20 cursor-pointer ${
                        selectedImage === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={`http://localhost:3001${image}`}
                        alt={`Property image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 25vw, 20vw"
                        style={{ objectFit: 'cover' }}
                        className="rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{property.title}</h1>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold capitalize">
                  {property.type}
                </span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <FaMapMarkerAlt className="mr-2" />
                <span>{property.location}, {property.city}, {property.state} {property.zipCode}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <FaBed className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaBath className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaHome className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Square Feet</p>
                    <p className="font-semibold">{property.squareFeet}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(property.amenities || []).map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FaCheck className="text-green-500" />
                      <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking/Buying Button - only show if user has correct role */}
              {user && (
                (property.type === 'RENT' && user.role?.toLowerCase() === 'tenant') ? (
                  <Button className="w-full mt-6">Book Rental</Button>
                ) : (property.type === 'SALE' && user.role?.toLowerCase() === 'buyer') ? (
                  <Button className="w-full mt-6">Buy Property</Button>
                ) : null
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ৳{property.price.toLocaleString()}/month
              </div>
              {/* Booking/Buying Button */}
              {user && property.status === 'AVAILABLE' && (
                <>
                  {user.role?.toLowerCase() === 'tenant' && property.type === 'RENT' && (
                    <Button
                      className="w-full mb-4"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const response = await fetch(`http://localhost:3001/properties/${property.id}/book`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                            },
                          });
                          if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            throw new Error(errorData.message || 'Failed to book property');
                          }
                          toast.success('Booking request sent!');
                        } catch (error) {
                          console.error('Book rental error:', error);
                          toast.error(error instanceof Error ? error.message : 'Failed to book property');
                        }
                      }}
                    >
                      Book Now
                    </Button>
                  )}
                  {user.role?.toLowerCase() === 'buyer' && property.type === 'SALE' && (
                    <Button
                      className="w-full mb-4"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const response = await fetch(`http://localhost:3001/properties/${property.id}/buy`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                            },
                          });
                          if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            throw new Error(errorData.message || 'Failed to buy property');
                          }
                          toast.success('Purchase request sent!');
                        } catch (error) {
                          console.error('Buy property error:', error);
                          toast.error(error instanceof Error ? error.message : 'Failed to buy property');
                        }
                      }}
                    >
                      Buy Now
                    </Button>
                  )}
                </>
              )}
              <Button className="w-full mb-4">Contact Owner</Button>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FaPhone className="text-gray-600" />
                  <span className="text-gray-600">
                    {property.yourPhone || 'Phone not available'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="text-gray-600" />
                  <span className="text-gray-600">
                    {property.yourEmail || 'Email not available'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 font-medium">Owner:</span>
                  <span className="text-gray-600">
                    {property.yourName || 'Name not available'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="space-y-2">
                <p className="text-gray-600">{property.address}</p>
                <p className="text-gray-600">{property.city}, {property.state} {property.zipCode}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Properties */}
      {property && (
        <RecommendationsSection 
          title="Similar Properties" 
          type="similar" 
          propertyId={property.id}
          limit={4} 
        />
      )}
    </div>
  );
} 