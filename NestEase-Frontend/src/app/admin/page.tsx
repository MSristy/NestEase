'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Building2, Users, Home, RefreshCw } from 'lucide-react';

interface Stats {
  total: number;
  verified?: number;
  active?: number;
  completed?: number;
}

interface DashboardStats {
  users: Stats;
  properties: Stats;
  serviceProviders: Stats;
  saveAndSwaps: Stats;
  barterItems: Stats;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to access this page');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('http://localhost:3001/admin/dashboard', {
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
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dashboard data:', data);
      
      const formattedData: DashboardStats = {
        users: {
          total: data.users?.total || 0,
          active: data.users?.active || 0
        },
        properties: {
          total: data.properties?.total || 0,
          verified: data.properties?.verified || 0
        },
        serviceProviders: {
          total: data.serviceProviders?.total || 0,
          verified: data.serviceProviders?.verified || 0
        },
        saveAndSwaps: {
          total: data.saveAndSwaps?.total || 0,
          completed: data.saveAndSwaps?.completed || 0
        },
        barterItems: {
          total: data.barterItems ? 
            (data.barterItems.addSwapItems || 0) + 
            (data.barterItems.sellProducts || 0) + 
            (data.barterItems.itemOffers || 0) : 0
        }
      };
      
      setStats(formattedData);
    } catch (error) {
      toast.error('Failed to load dashboard stats. Please try again later.');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-lg text-muted-foreground">Failed to load dashboard stats</p>
        <Button onClick={fetchStats} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your NestEase platform
          </p>
        </div>
        <Button onClick={fetchStats} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.properties.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.properties.verified} verified properties
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.serviceProviders.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.serviceProviders.verified} verified providers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Barter Items</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.barterItems.total}</div>
              <p className="text-xs text-muted-foreground">
                Total barter items
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 