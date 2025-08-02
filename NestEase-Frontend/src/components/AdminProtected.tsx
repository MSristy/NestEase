'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to access the admin panel');
      localStorage.setItem('intendedDestination', window.location.pathname);
      router.push('/auth/login');
      return;
    }

    // Check if user has admin role
    if (!isAdmin()) {
      toast.error('You do not have permission to access the admin panel');
      router.push('/');
      return;
    }
  }, [user, loading, isAdmin, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if user is not admin
  if (!user || !isAdmin()) {
    return null;
  }

  return <>{children}</>;
} 