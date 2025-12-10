'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiFetch } from '@/lib/utils';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  phone?: string;
  address?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status on mount and when token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('checkAuth: token from localStorage:', token);
      if (!token) {
        console.log('checkAuth: No token found');
        setUser(null);
        setLoading(false);
        return;
      }

      console.log('checkAuth: Making request to /users/profile');
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`);
      console.log('checkAuth: /users/profile response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('checkAuth: userData:', userData);
        setUser(userData);
      } else {
        if (response.status === 401) {
          console.log('checkAuth: Token is invalid or expired, removing from localStorage');
          localStorage.removeItem('token');
          setUser(null);
        }
        const errorText = await response.text();
        console.error('checkAuth: error response:', errorText);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Don't remove token on network errors, only on auth errors
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log('login: /api/auth/login response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('login: error response:', errorText);
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('login: data:', data);
      // Store token
      localStorage.setItem('token', data.token);
      // Fetch user profile immediately after login
      const profileResponse = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`);
      console.log('login: /users/profile response status:', profileResponse.status);
      if (profileResponse.ok) {
        const userData = await profileResponse.json();
        console.log('login: userData:', userData);
        setUser(userData);
        // Get the intended destination from localStorage or use the current path
        const intendedDestination = localStorage.getItem('intendedDestination') || pathname;
        localStorage.removeItem('intendedDestination'); // Clear the stored destination
        // If the intended destination is the login page or auth-related pages, redirect to home
        if (intendedDestination.startsWith('/auth/')) {
          router.push('/');
        } else {
          router.push(intendedDestination);
        }
      } else {
        const errorText = await profileResponse.text();
        console.error('login: error fetching user profile:', errorText);
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      
      // Fetch user profile immediately after registration
      const profileResponse = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`);

      if (profileResponse.ok) {
        const userData = await profileResponse.json();
        setUser(userData);
        
        // Get the intended destination from localStorage or use the current path
        const intendedDestination = localStorage.getItem('intendedDestination') || pathname;
        localStorage.removeItem('intendedDestination'); // Clear the stored destination

        // If the intended destination is the login page or auth-related pages, redirect to home
        if (intendedDestination.startsWith('/auth/')) {
          router.push('/');
        } else {
          router.push(intendedDestination);
        }
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/auth/login');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    isAdmin,
  };
} 
