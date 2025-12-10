'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaStar, FaMapMarkerAlt, FaBed, FaBath, FaHome, FaCheck } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, handleImageError } from '@/lib/utils';

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

interface Recommendation {
  propertyId: string;
  score: number;
  reasons: string[];
  property: Property;
}

interface RecommendationsSectionProps {
  title?: string;
  type?: 'personalized' | 'trending' | 'similar';
  propertyId?: string;
  limit?: number;
}

export default function RecommendationsSection({
  title = 'Recommended for You',
  type = 'personalized',
  propertyId,
  limit = 6,
}: RecommendationsSectionProps) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [user, type, propertyId, limit]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${process.env.NEXT_PUBLIC_API_URL}/recommendations/`;
      
      switch (type) {
        case 'personalized':
          if (!user) {
            url += 'new-user';
          } else {
            url += 'properties';
          }
          break;
        case 'trending':
          url += 'trending';
          break;
        case 'similar':
          if (!propertyId) {
            setError('Property ID is required for similar recommendations');
            return;
          }
          url += `similar/${propertyId}`;
          break;
      }

      url += `?limit=${limit}`;

      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (user && type === 'personalized') {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log(`Fetching recommendations from: ${url}`);
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Received ${data.length} recommendations:`, data);
      
      // Filter out recommendations with missing property data
      const validRecommendations = Array.isArray(data) ? data.filter(rec => rec.property) : [];
      console.log(`Filtered to ${validRecommendations.length} valid recommendations`);
      
      setRecommendations(validRecommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-blue-600 bg-blue-100';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getScoreText = (score: number) => {
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.6) return 'Great Match';
    if (score >= 0.4) return 'Good Match';
    return 'Fair Match';
  };

  const renderPropertyCard = (recommendation: any) => {
    const property = recommendation.property;
    
    // Debug logging
    console.log('Rendering property card:', { recommendation, property });
    
    if (!property) {
      console.warn('Property data is missing for recommendation:', recommendation);
      return null;
    }

    const score = recommendation.score || 0;
    const reasons = recommendation.reasons || [];

    // Use the utility function to get the proper image URL
    const imageUrl = property.images && property.images.length > 0 
      ? getImageUrl(property.images[0]) 
      : null;

    console.log('Final image URL:', imageUrl);

    return (
      <Card key={property.id} className="overflow-hidden">
        <div className="relative h-48 w-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={property.title || 'Property'}
              className="w-full h-full object-cover"
              onError={(e) => handleImageError(e)}
              onLoad={() => {
                console.log('Image loaded successfully:', imageUrl);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            Score: {score.toFixed(1)}
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800">
              {property.title || `${property.bedrooms || 'N/A'} Bed ${property.type || 'Property'}`}
            </h3>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {property.type}
            </span>
          </div>
          
          <p className="text-2xl font-bold text-blue-600 mb-2">
            ৳{property.price ? Number(property.price).toLocaleString() : 'N/A'}
          </p>
          
          <div className="flex items-center text-gray-600 mb-2">
            <FaMapMarkerAlt className="mr-1" />
            <span>{property.address || 'Address not available'}</span>
          </div>
          
          <div className="flex justify-between text-gray-600 mb-4">
            <div className="flex items-center">
              <FaBed className="mr-1" />
              <span>{property.bedrooms || 'N/A'} Beds</span>
            </div>
            <div className="flex items-center">
              <FaBath className="mr-1" />
              <span>{property.bathrooms || 'N/A'} Baths</span>
            </div>
            <div className="flex items-center">
              <FaHome className="mr-1" />
              <span>{property.squareFeet || 'N/A'} sq ft</span>
            </div>
          </div>
          
          {reasons.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Why recommended:</p>
              <div className="flex flex-wrap gap-1">
                {reasons.slice(0, 2).map((reason: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Amenities */}
          {(property.amenities && property.amenities.length > 0) && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                  >
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          <Link
            href={`/property/${property.id}`}
            className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchRecommendations} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">
            {type === 'personalized' && !user
              ? 'Sign in to get personalized recommendations'
              : 'No recommendations available at the moment'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {type === 'personalized' && user && (
          <Badge variant="outline" className="text-sm">
            AI-Powered
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          renderPropertyCard(rec))
        )}
      </div>

      {/* Show More Button */}
      {recommendations.length >= limit && (
        <div className="text-center mt-6">
          <Button variant="outline" onClick={fetchRecommendations}>
            Show More Recommendations
          </Button>
        </div>
      )}
    </div>
  );
} 
