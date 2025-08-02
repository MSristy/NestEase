'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AdminProtected from '@/components/AdminProtected';

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Properties', href: '/admin/properties' },
  { name: 'Service Providers', href: '/admin/service-providers' },
  { name: 'Save & Swap', href: '/admin/save-and-swap' },
  { name: 'Job Applications', href: '/admin/job-applications' },
  { name: 'Contact Messages', href: '/admin/contact-messages' },
  { name: 'Admin Management', href: '/admin/admin-management' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Your session has expired. Please log in again.');
            logout();
            return;
          }
          if (response.status === 403) {
            toast.error('You do not have permission to access the admin panel');
            router.push('/');
            return;
          }
          throw new Error('Failed to verify admin access');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Admin verification error:', error);
        toast.error('Failed to verify admin access');
        router.push('/');
      }
    };

    // Only verify if user is admin
    if (user?.role === 'admin') {
      verifyAdminAccess();
    }
  }, [user, router, logout]);

  const handleLogout = () => {
    logout();
  };

  return (
    <AdminProtected>
      <div className="min-h-screen bg-background">
        <nav className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-foreground">NestEase Admin</span>
                </div>
                <div className="hidden sm:ml-12 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname === item.href
                          ? 'border-primary text-foreground'
                          : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.name}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </AdminProtected>
  );
} 