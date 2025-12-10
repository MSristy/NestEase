'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Booking {
  id: string;
  property: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: string;
}

function PaymentForm({ booking }: { booking: Booking }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred during payment');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PaymentElement />
      </div>

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? 'Processing...' : `Pay $${booking.totalAmount.toLocaleString()}`}
      </Button>
    </form>
  );
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchBookingDetails();
  }, [params.id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch booking details
      const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const bookingData = await bookingResponse.json();
      setBooking(bookingData);

      // Create payment intent
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: params.id,
          amount: bookingData.totalAmount,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await paymentResponse.json();
      setClientSecret(clientSecret);
    } catch (error) {
      toast.error('Failed to load payment details');
      console.error('Error:', error);
      router.push('/property');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking || !clientSecret) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Not Available</h1>
          <p className="text-gray-600">The booking or payment details could not be loaded.</p>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Property:</span> {booking.property.title}</p>
                  <p><span className="font-medium">Check-in:</span> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Check-out:</span> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Total Amount:</span> ${booking.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance,
                }}
              >
                <PaymentForm booking={booking} />
              </Elements>

              <div className="text-sm text-gray-500">
                <p>• Secure payment powered by Stripe</p>
                <p>• Your payment information is encrypted</p>
                <p>• You will receive a confirmation email after successful payment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 