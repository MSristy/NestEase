import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaBath, FaBed, FaHome, FaCheck, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { addMonths, format } from 'date-fns';
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

interface PropertyDetailsModalProps {
  propertyId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function PropertyDetailsModal({ propertyId, open, onClose }: PropertyDetailsModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showRentForm, setShowRentForm] = useState(false);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [formData, setFormData] = useState({
    duration: '',
    moveInDate: '',
    occupants: '',
    offerPrice: '',
    isBachelor: false,
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [bill, setBill] = useState<any>(null);

  useEffect(() => {
    if (propertyId && open) {
      fetchPropertyDetails();
    }
    // Reset when closed
    if (!open) {
      setProperty(null);
      setSelectedImage(0);
    }
    // Pre-fill user info when modal or forms open
    if ((showRentForm || showBuyForm) && user) {
      setFormData((prev) => ({
        ...prev,
        buyerName: user.name ?? '',
        buyerEmail: user.email ?? '',
        buyerPhone: user.phone ?? '',
      }));
    }
    if (!(showRentForm || showBuyForm)) {
      setFormData((prev) => ({
        ...prev,
        duration: '',
        moveInDate: '',
        occupants: '',
        offerPrice: '',
        isBachelor: false,
      }));
    }
    // eslint-disable-next-line
  }, [propertyId, open, showRentForm, showBuyForm, user]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch property details');
      const data = await response.json();
      setProperty(data);
    } catch (error) {
      toast.error('Failed to fetch property details');
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    // Validate moveInDate and duration
    if (!formData.moveInDate || !formData.duration) {
      toast.error('Please provide both move-in date and duration.');
      setFormSubmitting(false);
      return;
    }
    // Calculate checkInDate and checkOutDate
    const checkInDate = new Date(formData.moveInDate);
    const months = Number(formData.duration) || 1;
    const checkOutDate = addMonths(checkInDate, months);
    const total = (property?.price || 0) * months;
    setBill({
      type: 'rent',
      months,
      total,
      moveInDate: formData.moveInDate,
      occupants: formData.occupants,
      isBachelor: formData.isBachelor,
      buyerName: formData.buyerName,
      buyerEmail: formData.buyerEmail,
      buyerPhone: formData.buyerPhone,
    });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/properties/${propertyId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          checkInDate: format(checkInDate, 'yyyy-MM-dd'),
          checkOutDate: format(checkOutDate, 'yyyy-MM-dd'),
          occupants: formData.occupants,
          isBachelor: formData.isBachelor,
          buyerName: formData.buyerName,
          buyerEmail: formData.buyerEmail,
          buyerPhone: formData.buyerPhone,
        }),
      });
      if (!response.ok) throw new Error('Failed to send rent request');
      setFormSubmitted(true);
      toast.success('Rent request sent for approval!');
      setShowRentForm(false);
      setFormData({ duration: '', moveInDate: '', occupants: '', offerPrice: '', isBachelor: false, buyerName: user?.name || '', buyerEmail: user?.email || '', buyerPhone: user?.phone || '' });
    } catch (error) {
      toast.error('Failed to send rent request');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setBill({
      type: 'buy',
      offerPrice: formData.offerPrice,
      buyerName: formData.buyerName,
      buyerEmail: formData.buyerEmail,
      buyerPhone: formData.buyerPhone,
      total: formData.offerPrice,
    });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/properties/${propertyId}/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          offerPrice: formData.offerPrice,
          buyerName: formData.buyerName,
          buyerEmail: formData.buyerEmail,
          buyerPhone: formData.buyerPhone,
        }),
      });
      if (!response.ok) throw new Error('Failed to send buy request');
      setFormSubmitted(true);
      toast.success('Buy request sent for approval!');
      setShowBuyForm(false);
      setFormData({ duration: '', moveInDate: '', occupants: '', offerPrice: '', isBachelor: false, buyerName: user?.name || '', buyerEmail: user?.email || '', buyerPhone: user?.phone || '' });
    } catch (error) {
      toast.error('Failed to send buy request');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl w-full">
          <DialogHeader>
            <DialogTitle>Property Details</DialogTitle>
            <DialogDescription>
              View detailed information about this property
            </DialogDescription>
          </DialogHeader>
          {loading ? (
            <div className="text-center py-8">Loading property details...</div>
          ) : !property ? (
            <div className="text-center py-8">Property not found</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image Gallery */}
                <Card>
                  <CardContent className="p-0">
                    <div className="relative h-[300px] w-full">
                      <Image
                        src={property.images && property.images.length > 0 
                          ? getImageUrl(property.images[selectedImage])
                          : '/placeholder-property.jpg'}
                        alt={property.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                        className="object-cover"
                        priority
                        onError={(e) => handleImageError(e, '/placeholder-property.jpg')}
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
                            className={`relative h-20 w-20 rounded cursor-pointer border-2 ${
                              selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                            }`}
                            onClick={() => setSelectedImage(index)}
                          >
                            <Image
                              src={getImageUrl(image)}
                              alt={`Property image ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="rounded object-cover"
                              onError={(e) => handleImageError(e, '/placeholder-property.jpg')}
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
                      <h1 className="text-2xl font-bold text-gray-800">{property.title}</h1>
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
                  </CardContent>
                </Card>
              </div>
              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      ৳{property.price.toLocaleString()}{property.type === 'SALE' ? '' : '/month'}
                    </div>
                    {/* Rent/Buy Buttons */}
                    {!formSubmitted && (
                      <>
                        {property.type === 'RENT' && (
                          <>
                            {user ? (
                              <Button className="w-full mb-2" onClick={() => setShowRentForm(true)}>
                                Rent this Property
                              </Button>
                            ) : (
                              <Button className="w-full mb-2" onClick={() => router.push('/auth/login')}>
                                Login to Rent
                              </Button>
                            )}
                          </>
                        )}
                        {property.type === 'SALE' && (
                          <>
                            {user ? (
                              <Button className="w-full mb-2" onClick={() => setShowBuyForm(true)}>
                                Buy this Property
                              </Button>
                            ) : (
                              <Button className="w-full mb-2" onClick={() => router.push('/auth/login')}>
                                Login to Buy
                              </Button>
                            )}
                          </>
                        )}
                      </>
                    )}
                    {/* Bill/Summary */}
                    {formSubmitted && bill && (
                      <div className="mt-4 p-4 bg-card text-card-foreground rounded-lg border shadow-sm">
                        <h3 className="font-bold mb-2 text-lg">Request Summary</h3>
                        {bill.type === 'rent' ? (
                          <>
                            <div className="text-sm mb-1">Duration: {bill.months} month(s)</div>
                            <div className="text-sm mb-1">Move-in Date: {bill.moveInDate}</div>
                            <div className="text-sm mb-1">Occupants: {bill.occupants}</div>
                            <div className="text-sm mb-1">Bachelor: {bill.isBachelor ? 'Yes' : 'No'}</div>
                            <div className="font-bold mt-3 text-lg text-green-600 dark:text-green-400">Total: ৳{bill.total}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-sm mb-1">Offer Price: ৳{bill.offerPrice}</div>
                            <div className="font-bold mt-3 text-lg text-green-600 dark:text-green-400">Total: ৳{bill.total}</div>
                          </>
                        )}
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Your request has been sent to the owner for approval. You will be notified upon approval.
                          </p>
                        </div>
                        <Button className="w-full mt-4" onClick={onClose}>Close</Button>
                      </div>
                    )}
                    <Button className="w-full mb-4">Contact Details</Button>
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
                  </CardContent>
                </Card>
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
          )}
        </DialogContent>
      </Dialog>
      {/* Nested Dialog for Rent Form */}
      <Dialog open={showRentForm} onOpenChange={setShowRentForm}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Rent this Property</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit a rent request for this property.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRentSubmit} className="space-y-3 mt-2">
            <div>
              <label className="block text-sm font-medium">Duration (months)</label>
              <Input
                type="number"
                min="1"
                required
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Move-in Date</label>
              <Input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.moveInDate}
                onChange={e => setFormData({ ...formData, moveInDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Number of Occupants</label>
              <Input
                type="number"
                min="1"
                required
                value={formData.occupants}
                onChange={e => setFormData({ ...formData, occupants: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isBachelor"
                checked={formData.isBachelor}
                onChange={e => setFormData({ ...formData, isBachelor: e.target.checked })}
              />
              <label htmlFor="isBachelor" className="text-sm">I am a bachelor</label>
            </div>
            <div>
              <label className="block text-sm font-medium">Your Name</label>
              <Input
                type="text"
                required
                value={formData.buyerName}
                onChange={e => setFormData({ ...formData, buyerName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                required
                value={formData.buyerEmail}
                onChange={e => setFormData({ ...formData, buyerEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <Input
                type="tel"
                required
                value={formData.buyerPhone}
                onChange={e => setFormData({ ...formData, buyerPhone: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={formSubmitting}>
              {formSubmitting ? 'Submitting...' : 'Submit Rent Request'}
            </Button>
            <Button type="button" variant="outline" className="w-full mt-2" onClick={() => setShowRentForm(false)}>
              Cancel
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Nested Dialog for Buy Form */}
      <Dialog open={showBuyForm} onOpenChange={setShowBuyForm}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Buy this Property</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit a buy request for this property.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBuySubmit} className="space-y-3 mt-2">
            <div>
              <label className="block text-sm font-medium">Offer Price (৳)</label>
              <Input
                type="number"
                min="1"
                required
                value={formData.offerPrice}
                onChange={e => setFormData({ ...formData, offerPrice: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Your Name</label>
              <Input
                type="text"
                required
                value={formData.buyerName}
                onChange={e => setFormData({ ...formData, buyerName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                required
                value={formData.buyerEmail}
                onChange={e => setFormData({ ...formData, buyerEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <Input
                type="tel"
                required
                value={formData.buyerPhone}
                onChange={e => setFormData({ ...formData, buyerPhone: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={formSubmitting}>
              {formSubmitting ? 'Submitting...' : 'Submit Buy Request'}
            </Button>
            <Button type="button" variant="outline" className="w-full mt-2" onClick={() => setShowBuyForm(false)}>
              Cancel
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 