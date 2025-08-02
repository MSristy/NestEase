'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaBuilding, FaPhone, FaMapMarkerAlt, FaTools, FaInfoCircle, FaStar, FaImage, FaFileUpload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const formSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  serviceType: z.string().min(1, 'Please select a service type'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  rating: z.number().min(0).max(5).optional(),
});

type ServiceProviderFormValues = z.infer<typeof formSchema>;

const serviceTypes = [
  'TV Repair',
  'AC Repair',
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

export default function ServiceProviderProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ServiceProviderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length + selectedImages.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setSelectedImages(prev => [...prev, ...validFiles]);
    setError('');

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ServiceProviderFormValues) => {
    if (!user) {
      setError('You must be logged in to submit this form');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Format and validate data
      const locationParts = data.location.split(',').map(part => part.trim());
      const city = locationParts[0] || data.location;
      const state = locationParts[1] || '';

      const formData = new FormData();
      formData.append('businessName', data.businessName.trim());
      formData.append('serviceType', data.serviceType);
      formData.append('description', data.description.trim());
      formData.append('phone', data.phone.trim());
      formData.append('address', data.location.trim());
      formData.append('city', city);
      formData.append('state', state);
      formData.append('zipCode', '0000');
      formData.append('services', data.description.trim());
      formData.append('rating', (data.rating || 0).toString());

      // Append images
      selectedImages.forEach((image, index) => {
        formData.append('images', image);
      });

      console.log('Sending data with images:', selectedImages.length);

      const response = await fetch('http://localhost:3001/service-providers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      setSuccess(true);
      setTimeout(() => {
        router.push('/services');
      }, 2000);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating your profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user?.id && user.role === 'SERVICE_PROVIDER') {
      const fetchMyBookings = async () => {
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
      fetchMyBookings();
    }
    // eslint-disable-next-line
  }, [user?.id, user?.role]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Card className="w-full max-w-md bg-card border border-border shadow rounded-xl">
          <CardContent className="p-6">
            <div className="text-center">
              <FaInfoCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-muted-foreground">Please log in to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg p-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Complete Your Service Provider Profile
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of trusted service providers on NestEase. Complete your profile to start receiving bookings from customers.
            </p>
          </div>

          <Card className="shadow-none border-0 bg-card">
            <CardHeader className="bg-card border-b border-border">
              <CardTitle className="text-2xl font-bold text-center text-foreground">
                <FaBuilding className="inline-block mr-2 text-blue-600" />
                Business Information
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Tell us about your business to start offering services
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-card">
              {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-green-800 dark:text-green-200 font-medium">Profile created successfully!</p>
                      <p className="text-green-700 dark:text-green-300 text-sm">Redirecting to services page...</p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
                      <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Business Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <FaBuilding className="text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-foreground">Business Details</h3>
                  </div>

                  {/* Business Name */}
                  <div>
                    <Label htmlFor="businessName" className="text-sm font-medium text-foreground">
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      placeholder="Enter your business name"
                      className="mt-1"
                      {...register('businessName')}
                    />
                    {errors.businessName && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.businessName.message}</p>
                    )}
                  </div>

                  {/* Service Type */}
                  <div>
                    <Label htmlFor="serviceType" className="text-sm font-medium text-foreground">
                      Service Type *
                    </Label>
                    <Select onValueChange={(value) => setValue('serviceType', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.serviceType && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.serviceType.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-foreground">
                      Business Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your business, experience, expertise, and what makes you unique. Include your years of experience, certifications, and specializations..."
                      rows={4}
                      className="mt-1"
                      {...register('description')}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum 20 characters. Be detailed to attract more customers.
                    </p>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center mb-4">
                    <FaPhone className="text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+880 1XXX XXXXXX"
                      className="mt-1"
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-foreground">
                      <FaMapMarkerAlt className="inline-block mr-1" />
                      Service Area *
                    </Label>
                    <Input
                      id="location"
                      placeholder="City, District (e.g., Dhaka, Gulshan)"
                      className="mt-1"
                      {...register('location')}
                    />
                    {errors.location && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.location.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Specify the areas where you provide services
                    </p>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center mb-4">
                    <FaStar className="text-yellow-500 mr-2" />
                    <h3 className="text-lg font-semibold text-foreground">Rating & Reviews</h3>
                  </div>

                  {/* Rating */}
                  <div>
                    <Label htmlFor="rating" className="text-sm font-medium text-foreground">
                      Initial Rating (0-5) *
                    </Label>
                    <div className="mt-1 flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setValue('rating', star)}
                          className={`text-2xl ${
                            (watch('rating') || 0) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                          } hover:text-yellow-400 transition-colors`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {watch('rating') || 0} out of 5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center mb-4">
                    <FaImage className="text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-foreground">Business Images</h3>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <Label htmlFor="images" className="text-sm font-medium text-foreground">
                      Upload Business Images (Max 5)
                    </Label>
                    <div className="mt-1">
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted hover:bg-accent transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FaFileUpload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB each</p>
                          </div>
                          <input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload images of your work, business, or team to build trust
                    </p>
                  </div>

                  {/* Image Preview */}
                  {imagePreview.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-foreground">Preview</Label>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {imagePreview.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-border">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Profile...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <FaTools className="mr-2" />
                        Create Service Provider Profile
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-card rounded-lg shadow-md border border-border">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBuilding className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Professional Profile</h3>
              <p className="text-muted-foreground text-sm">Showcase your business professionally to attract more customers</p>
            </div>
            <div className="text-center p-6 bg-card rounded-lg shadow-md border border-border">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="text-green-600 text-xl" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Direct Bookings</h3>
              <p className="text-muted-foreground text-sm">Receive direct bookings from customers in your service area</p>
            </div>
            <div className="text-center p-6 bg-card rounded-lg shadow-md border border-border">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTools className="text-purple-600 text-xl" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Grow Your Business</h3>
              <p className="text-muted-foreground text-sm">Expand your customer base and increase your earnings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 