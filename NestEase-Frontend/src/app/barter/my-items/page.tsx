'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { FaEdit, FaTrash, FaExchangeAlt } from 'react-icons/fa';

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  images: string[];
  location: string;
  status: 'available' | 'pending' | 'swapped';
}

export default function MyItemsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchMyItems();
  }, [user]);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/swap-items/my-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      toast.error('Failed to load items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/swap-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      toast.success('Item deleted successfully');
      fetchMyItems();
    } catch (error) {
      toast.error('Failed to delete item');
      console.error('Error deleting item:', error);
    }
  };

  const handleEditItem = (itemId: string) => {
    router.push(`/barter/edit/${itemId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Items</h1>
        <Button
          onClick={() => router.push('/barter/add-item')}
          className="flex items-center gap-2"
        >
          Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={item.images[0] || '/placeholder-item.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Category: {item.category}</span>
                      <span className="mx-2">•</span>
                      <span>Condition: {item.condition}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <span>Location: {item.location}</span>
                      <span className="mx-2">•</span>
                      <span className={`font-semibold ${item.status === 'available' ? 'text-green-500' :
                          item.status === 'pending' ? 'text-yellow-500' :
                            'text-blue-500'
                        }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditItem(item.id)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-gray-500 mb-4">
              You haven't listed any items for swap yet.
            </p>
            <Button
              onClick={() => router.push('/barter/add-item')}
            >
              Add Your First Item
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 
