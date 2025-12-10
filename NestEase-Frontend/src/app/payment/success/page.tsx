'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FaCheckCircle } from 'react-icons/fa';

interface Booking {
  id: string;
  property: {
    id: string;
    title: string;
    images: string[];
  };
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: string;
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!searchParams) {
      router.push('/property');
      return;
    }

    const paymentIntent = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus === 'succeeded' && paymentIntent) {
      fetchBookingDetails(paymentIntent);
    } else {
      toast.error('Payment was not successful');
      router.push('/property');
    }
  }, [searchParams]);

  const fetchBookingDetails = async (paymentIntentId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/confirm/${paymentIntentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      const data = await response.json();
      setBooking(data.booking);
    } catch (error) {
      toast.error('Failed to load booking details');
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

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-gray-600">The booking details could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="text-center">
              <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle>Payment Successful!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Booking Confirmation</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Booking ID:</span> {booking.id}</p>
                  <p><span className="font-medium">Property:</span> {booking.property.title}</p>
                  <p><span className="font-medium">Check-in:</span> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Check-out:</span> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Total Amount:</span> ${booking.totalAmount.toLocaleString()}</p>
                  <p><span className="font-medium">Status:</span> <span className="text-green-500">{booking.status}</span></p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  A confirmation email has been sent to your registered email address.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => router.push('/property')}
                    variant="outline"
                  >
                    Browse More Properties
                  </Button>
                  <Button
                    onClick={() => router.push('/bookings')}
                  >
                    View My Bookings
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>• Your booking is confirmed and secured</p>
                <p>• You can manage your booking from the bookings page</p>
                <p>• Contact support if you need any assistance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
} 
