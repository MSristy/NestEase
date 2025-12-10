'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Users, Shield, UserPlus } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [promotingUserId, setPromotingUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.filter((user: User) => user.role !== 'admin'));
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/admin/admins', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      toast.error('Failed to fetch admins');
    }
  };

  const promoteUserToAdmin = async (userId: number) => {
    try {
      setPromotingUserId(userId);
      const token = localStorage.getItem('token');
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/admin/promote-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to promote user');
      }

      toast.success('User promoted to admin successfully');
      await Promise.all([fetchUsers(), fetchAdmins()]);
    } catch (error) {
      toast.error('Failed to promote user to admin');
    } finally {
      setPromotingUserId(null);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchAdmins()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">
            Manage admin users and promote regular users to admin role
          </p>
        </div>
      </div>

      {/* Current Admins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Admin Users ({admins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{admin.name}</h3>
                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Admin since: {new Date(admin.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    Admin
                  </span>
                </div>
              </div>
            ))}
            {admins.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No admin users found
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Promote Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Promote Users to Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Current role: {user.role}
                  </p>
                </div>
                <Button
                  onClick={() => promoteUserToAdmin(user.id)}
                  disabled={promotingUserId === user.id}
                  size="sm"
                >
                  {promotingUserId === user.id ? (
                    'Promoting...'
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Promote to Admin
                    </>
                  )}
                </Button>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                {searchQuery ? 'No users found matching your search' : 'No users available for promotion'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
