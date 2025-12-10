'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-6xl text-green-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Order Confirmed!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600 text-lg">
              Thank you for your order! Your payment has been processed successfully.
            </p>
            <p className="text-gray-600">
              You will receive a confirmation email shortly with your order details.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  <FaHome className="mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/barter">
                <Button variant="outline" className="w-full sm:w-auto">
                  <FaShoppingBag className="mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
