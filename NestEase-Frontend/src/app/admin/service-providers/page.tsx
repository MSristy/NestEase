'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ServiceProvider {
  id: number;
  businessName: string;
  serviceType: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  rating?: number | null;
  isVerified: boolean;
  owner: {
    id: number;
    name: string;
    email: string;
  };
}

export default function ServiceProvidersPage() {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const fetchServiceProviders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to access this page');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('http://localhost:3001/admin/service-providers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/auth/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch service providers: ${response.statusText}`);
      }

      const data = await response.json();
      setServiceProviders(data);
    } catch (error) {
      toast.error('Failed to load service providers. Please try again later.');
      console.error('Error fetching service providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/service-providers/${id}/verify`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to verify service provider');
      toast.success('Service provider verified successfully');
      fetchServiceProviders();
    } catch (error) {
      toast.error('Failed to verify service provider');
      console.error('Error verifying service provider:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service provider?')) return;
    try {
      const response = await fetch(`http://localhost:3001/admin/service-providers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete service provider');
      toast.success('Service provider deleted successfully');
      fetchServiceProviders();
    } catch (error) {
      toast.error('Failed to delete service provider');
      console.error('Error deleting service provider:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Service Provider Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>{provider.businessName}</TableCell>
                  <TableCell>{provider.serviceType}</TableCell>
                  <TableCell>
                    {provider.address}, {provider.city}, {provider.state}
                  </TableCell>
                  <TableCell>
                    {typeof provider.rating === 'number' && !isNaN(provider.rating) 
                      ? provider.rating.toFixed(1) 
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    {provider.owner.name} ({provider.owner.email})
                  </TableCell>
                  <TableCell>
                    <Badge variant={provider.isVerified ? 'success' : 'secondary'}>
                      {provider.isVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!provider.isVerified && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerify(provider.id)}
                        >
                          Verify
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(provider.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 