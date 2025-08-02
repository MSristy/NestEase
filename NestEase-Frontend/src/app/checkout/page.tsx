'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaTools, FaHome, FaShoppingBag } from 'react-icons/fa';
import Image from 'next/image';

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: 'card' | 'cash';
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  notes: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { cartItems, getTotalAmount, clearCart } = useCart();
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    notes: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log('Checkout useEffect - user:', user);
    console.log('Checkout useEffect - loading:', loading);
    console.log('Checkout useEffect - cartItems:', cartItems);
    console.log('Checkout useEffect - localStorage token:', localStorage.getItem('token'));
    
    // Wait for auth to finish loading
    if (loading) {
      console.log('Auth is still loading, waiting...');
      return;
    }

    // Only redirect if user is not logged in
    if (!user) {
      console.log('No user found, redirecting to login');
      toast.error('Please log in to continue with checkout');
      router.push('/auth/login');
      return;
    }

    // Only redirect if cart is empty
    if (cartItems.length === 0) {
      console.log('Cart is empty, redirecting to cart');
      toast.error('Your cart is empty');
      router.push('/cart');
      return;
    }

    console.log('User is logged in and cart has items, proceeding with checkout');

    // Pre-fill form with user data
    setFormData(prev => ({
      ...prev,
      fullName: user.name || '',
      email: user.email || '',
    }));
  }, [user, loading, cartItems, router]);

  const getItemIcon = (item: any) => {
    switch (item.type) {
      case 'service':
        return <FaTools className="text-blue-600" />;
      case 'property':
        return <FaHome className="text-green-600" />;
      default:
        return <FaShoppingBag className="text-purple-600" />;
    }
  };

  const getItemTypeLabel = (item: any) => {
    switch (item.type) {
      case 'service':
        return 'Service';
      case 'property':
        return 'Property';
      case 'offer':
        return 'Offer';
      default:
        return 'Product';
    }
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.fullName.trim()) errors.push('Full name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.phone.trim()) errors.push('Phone number is required');
    if (!formData.address.trim()) errors.push('Address is required');
    if (!formData.city.trim()) errors.push('City is required');
    if (!formData.state.trim()) errors.push('State is required');
    if (!formData.zipCode.trim()) errors.push('ZIP code is required');
    
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) errors.push('Card number is required');
      if (!formData.cardExpiry.trim()) errors.push('Card expiry is required');
      if (!formData.cardCvv.trim()) errors.push('CVV is required');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(`Please fix the following errors: ${errors.join(', ')}`);
      return;
    }

    setIsProcessing(true);

    try {
      // Here you would integrate with your payment processor (Stripe, PayPal, etc.)
      // For now, we'll simulate a successful payment
      
      // Process each item based on its type
      for (const item of cartItems) {
        switch (item.type) {
          case 'service':
            await processServiceBooking(item);
            break;
          case 'property':
            await processPropertyBooking(item);
            break;
          default:
            await processProductPurchase(item);
            break;
        }
      }

      // Clear cart after successful payment
      clearCart();
      
      toast.success('Payment processed successfully!');
      router.push('/order-confirmation');
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processServiceBooking = async (item: any) => {
    const token = localStorage.getItem('token');
    
    // If this is a service booking from the cart, process the payment
    if (item.serviceBooking) {
      const response = await fetch(`http://localhost:3001/service-providers/bookings/${item.serviceBooking.id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentMethod: 'online' }),
      });

      if (!response.ok) {
        throw new Error('Failed to process service payment');
      }

      const result = await response.json();
      console.log('Service payment processed:', result);
      return;
    }

    // For new service bookings (fallback)
    const bookingData = {
      serviceType: item.serviceType,
      serviceDate: new Date().toISOString().split('T')[0], // Today's date
      serviceTime: '09:00', // Default time
      duration: 1, // Default duration
      requestedServices: [item.businessName],
      description: formData.notes,
      address: formData.address,
    };

    const response = await fetch(`http://localhost:3001/service-providers/${item.id}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error('Failed to book service');
    }
  };

  const processPropertyBooking = async (item: any) => {
    const token = localStorage.getItem('token');
    
    // If this is a property booking from the cart, process the payment
    if (item.propertyBooking) {
      const response = await fetch(`http://localhost:3001/properties/bookings/${item.propertyBooking.id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentMethod: 'online' }),
      });

      if (!response.ok) {
        throw new Error('Failed to process property payment');
      }

      const result = await response.json();
      console.log('Property payment processed:', result);
      
      // If it's a Stripe payment, redirect to payment page
      if (result.clientSecret) {
        // Store payment details in session storage for payment page
        sessionStorage.setItem('paymentDetails', JSON.stringify({
          clientSecret: result.clientSecret,
          bookingId: result.bookingId,
          amount: result.amount,
          type: 'property'
        }));
        
        // Redirect to payment page
        router.push(`/payment/${result.bookingId}`);
        return;
      }
      
      return;
    }

    // For new property bookings (fallback)
    const bookingData = {
      propertyId: item.id,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      address: formData.address,
      notes: formData.notes,
    };

    const response = await fetch(`http://localhost:3001/properties/${item.id}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error('Failed to book property');
    }
  };

  const processProductPurchase = async (item: any) => {
    // For barter items, you might want to create an order
    const token = localStorage.getItem('token');
    const orderData = {
      itemId: item.id,
      itemType: item.type || 'sell',
      quantity: item.quantity || 1,
      address: formData.address,
      notes: formData.notes,
    };

    const response = await fetch(`http://localhost:3001/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to process product purchase');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful payment
      clearCart();
      
      toast.success('Payment processed successfully!');
      router.push('/order-confirmation');
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your authentication.</p>
        </div>
      </div>
    );
  }

  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Redirecting...</h2>
          <p className="text-muted-foreground">
            {!user ? 'Please log in to continue with checkout.' : 'Your cart is empty.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-foreground hover:text-primary transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.images || item.imageUrl || '/placeholder.jpg'}
                          alt={item.product_name || item.title || 'Item'}
                          fill
                          className="object-cover rounded-lg"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getItemIcon(item)}
                          <span className="text-xs bg-background px-2 py-1 rounded">
                            {getItemTypeLabel(item)}
                          </span>
                        </div>
                        <h4 className="font-semibold text-card-foreground">
                          {item.product_name || item.title || item.businessName}
                        </h4>
                        {item.serviceType && (
                          <p className="text-sm text-muted-foreground">Service: {item.serviceType}</p>
                        )}
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity || 1}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-card-foreground">৳{item.price}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-card-foreground">৳{getTotalAmount()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-card-foreground">৳0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-card-foreground">৳0</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                      <span className="text-card-foreground">Total</span>
                      <span className="text-card-foreground">৳{getTotalAmount()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle>Checkout Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-card-foreground">
                      <FaUser />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-card-foreground">
                      <FaMapMarkerAlt />
                      Shipping Address
                    </h3>
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-card-foreground">
                      <FaCreditCard />
                      Payment Method
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-muted-foreground">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        />
                        <span>Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center space-x-2 text-muted-foreground">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        />
                        <span>Cash on Delivery</span>
                      </label>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardExpiry">Expiry Date *</Label>
                            <Input
                              id="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardCvv">CVV *</Label>
                            <Input
                              id="cardCvv"
                              value={formData.cardCvv}
                              onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any special instructions or requirements..."
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                  >
                    {isProcessing ? 'Processing Payment...' : `Pay ৳${getTotalAmount()}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 