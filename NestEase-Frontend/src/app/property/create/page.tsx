'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreatePropertyPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  // Always call useState at the top, with safe defaults
  const [formData, setFormData] = useState({
    yourName: '',
    yourPhone: '',
    yourEmail: '',
    title: '',
    description: '',
    price: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    type: '',
    category: '',
    amenities: [] as string[],
    images: [] as string[],
    bachelorFriendly: false,
  });

  // Populate formData with user info when user is loaded
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        yourName: user.name || '',
        yourPhone: user.phone || '',
        yourEmail: user.email || '',
        type: user.role === 'LANDLORD' ? 'RENT' : user.role === 'SELLER' ? 'SALE' : '',
      }));
    }
  }, [user]);

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-100 text-gray-700 p-4 rounded-lg text-center">
          Loading...
        </div>
      </div>
    );
  }

  if (!user || !['landlord', 'seller'].includes(user.role?.toLowerCase())) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
          Only Landlords and Sellers can list properties. Please log in with the appropriate account.
        </div>
      </div>
    );
  }

  const propertyCategories = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' },
  ];

  const availableAmenities = [
    'WiFi',
    'Parking',
    'Lift',
    'Gas',
    'Garden',
    'Balcony',
    'Security',
    'Swimming Pool',
    'Gym',
    'Air Conditioning',
    'Furnished',
    'Pet Friendly',
    'Power Backup',
    'Water Supply',
    'CCTV'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to list a property');
      router.push('/auth/login');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const squareFeetValue = parseInt(formData.squareFeet, 10);
      
      // Use correct endpoint based on role
      const endpoint = user.role === 'LANDLORD' ? 'rent' : 'sale';
      const response = await fetch(`http://localhost:3001/properties/${endpoint}` , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          squareFeet: squareFeetValue,
          amenities: formData.amenities,
          type: user.role === 'LANDLORD' ? 'RENT' : 'SALE',
          category: formData.category,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create property');
      }

      const data = await response.json();
      
      toast.success('Property listed successfully! You can view it in your listings.', {
        duration: 5000,
        position: 'top-center',
      });

      setTimeout(() => {
        router.push('/property');
      }, 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to list property');
      console.error('Error creating property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'squareFeet') {
      const intValue = parseInt(value, 10);
      if (!isNaN(intValue)) {
        setFormData((prev) => ({ ...prev, [name]: intValue.toString() }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((item) => item !== value),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/properties/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload images');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...data.urls]
      }));
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload images');
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>List Your Property</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="yourName">Your Name</Label>
                <Input
                  id="yourName"
                  name="yourName"
                  value={formData.yourName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yourPhone">Phone Number</Label>
                <Input
                  id="yourPhone"
                  name="yourPhone"
                  type="tel"
                  value={formData.yourPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yourEmail">Email</Label>
                <Input
                  id="yourEmail"
                  name="yourEmail"
                  type="email"
                  value={formData.yourEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{user.role === 'SELLER' ? 'Property Price' : 'Price per Month'}</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms">Number of Bedrooms</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Number of Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="squareFeet">Square Feet</Label>
                <Input
                  id="squareFeet"
                  name="squareFeet"
                  type="number"
                  value={formData.squareFeet}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="1"
                  placeholder="Enter square footage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Property Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property category" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={amenity}
                      value={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={handleAmenitiesChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor={amenity} className="text-sm font-medium text-gray-700">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="bachelorFriendly"
                  checked={formData.bachelorFriendly}
                  onChange={(e) => setFormData(prev => ({ ...prev, bachelorFriendly: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="bachelorFriendly" className="text-sm font-medium text-gray-700">
                  Bachelor-Friendly Property
                </Label>
              </div>
              <p className="text-sm text-gray-600">
                Check this if you welcome bachelor tenants. This helps bachelors find suitable accommodations more easily.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Property Images (Upload multiple images)</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                required
              />
              <p className="text-sm text-gray-600">You can select multiple images at once. Upload at least one image.</p>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'List Property'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 