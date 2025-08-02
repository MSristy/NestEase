'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface NewItem {
  title: string;
  description: string;
  category: string;
  condition: string;
  location: string;
  images: File[];
}

export default function AddItemPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState<NewItem>({
    title: '',
    description: '',
    category: '',
    condition: '',
    location: '',
    images: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      // First, create the item
      const itemResponse = await fetch('http://localhost:3001/swap-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newItem.title,
          description: newItem.description,
          category: newItem.category,
          condition: newItem.condition,
          location: newItem.location,
        }),
      });

      if (!itemResponse.ok) {
        throw new Error('Failed to create item');
      }

      const itemData = await itemResponse.json();

      // Then, upload images if any
      if (newItem.images.length > 0) {
        const formData = new FormData();
        newItem.images.forEach((file) => {
          formData.append('images', file);
        });

        const imageResponse = await fetch(`http://localhost:3001/swap-items/${itemData.id}/images`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error('Failed to upload images');
        }
      }

      toast.success('Item added successfully');
      router.push('/barter/my-items');
    } catch (error) {
      toast.error('Failed to add item');
      console.error('Error adding item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setNewItem((prev) => ({
      ...prev,
      images: Array.from(files),
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Item</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => setNewItem((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={newItem.condition}
                  onValueChange={(value) => setNewItem((prev) => ({ ...prev, condition: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newItem.location}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Images</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {newItem.images.map((file, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/barter/my-items')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 