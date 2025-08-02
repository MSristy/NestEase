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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Search, Plus, RefreshCw, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  isVerified: boolean;
  owner: {
    id: number;
    name: string;
    email: string;
  };
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to access this page');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('http://localhost:3001/admin/properties', {
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
        throw new Error(`Failed to fetch properties: ${response.statusText}`);
      }

      const data = await response.json();
      setProperties(data);
    } catch (error) {
      toast.error('Failed to load properties. Please try again later.');
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/property/${id}/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to verify property');
      toast.success('Property verified successfully');
      fetchProperties();
    } catch (error) {
      toast.error('Failed to verify property');
      console.error('Error verifying property:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      const response = await fetch(`http://localhost:3001/admin/property/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete property');
      toast.success('Property deleted successfully');
      fetchProperties();
    } catch (error) {
      toast.error('Failed to delete property');
      console.error('Error deleting property:', error);
    }
  };

  const filteredProperties = properties
    .filter((property) => {
      const matchesSearch = 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.owner.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'verified' && property.isVerified) ||
        (statusFilter === 'pending' && !property.isVerified);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return b.id - a.id;
        case 'oldest':
          return a.id - b.id;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Management</h1>
          <p className="text-muted-foreground">
            Manage and verify property listings
          </p>
        </div>
        <Button onClick={fetchProperties} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No properties found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell>
                        {property.address}, {property.city}, {property.state}
                      </TableCell>
                      <TableCell>Tk {property.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{property.owner.name}</span>
                          <span className="text-sm text-muted-foreground">{property.owner.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={property.isVerified ? 'success' : 'secondary'}>
                          {property.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!property.isVerified && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerify(property.id)}
                            >
                              Verify
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 