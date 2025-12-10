'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FaMapMarkerAlt, FaSpinner, FaStar, FaExchangeAlt, FaPlus, FaSearch, FaHeart, FaRegHeart, FaFilter, FaHistory, FaComments } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  images: string[];
  location: string;
  userId: string;
  user: {
    name: string;
    rating: number;
    reviews: number;
  };
  createdAt: string;
  status: 'available' | 'pending' | 'swapped';
  isFavorite?: boolean;
}

interface SwapRequest {
  id: string;
  itemId: string;
  offeredItemId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  item: Item;
  offeredItem: Item;
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  sender: {
    name: string;
  };
}

export default function SaveSwapPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('browse');
  const [showAddItem, setShowAddItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    condition: [] as string[],
    location: '',
    minRating: 0,
    maxDistance: 50,
  });
  const [showChat, setShowChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [itemHistory, setItemHistory] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    location: '',
    images: [] as string[],
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchItems();
    fetchSwapRequests();
    fetchFavorites();
    fetchItemHistory();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchChatMessages(selectedChat);
    }
  }, [selectedChat]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/swap-items', {
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

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setItems(items.map(item => ({
        ...item,
        isFavorite: data.includes(item.id)
      })));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchItemHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/item-history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch item history');
      }

      const data = await response.json();
      setItemHistory(data);
    } catch (error) {
      console.error('Error fetching item history:', error);
    }
  };

  const fetchChatMessages = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat messages');
      }

      const data = await response.json();
      setChatMessages(data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleToggleFavorite = async (itemId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${itemId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      setItems(items.map(item => 
        item.id === itemId 
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      ));
    } catch (error) {
      toast.error('Failed to update favorite status');
      console.error('Error toggling favorite:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedChat,
          content: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const message = await response.json();
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    }
  };

  const fetchSwapRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/swap-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch swap requests');
      }

      const data = await response.json();
      setSwapRequests(data);
    } catch (error) {
      toast.error('Failed to load swap requests');
      console.error('Error fetching swap requests:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/swap-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      toast.success('Item added successfully');
      fetchItems();
      setShowAddItem(false);
      setNewItem({
        title: '',
        description: '',
        category: '',
        condition: '',
        location: '',
        images: [],
      });
    } catch (error) {
      toast.error('Failed to add item');
      console.error('Error adding item:', error);
    }
  };

  const handleSwapRequest = async (itemId: string, offeredItemId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/swap-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId,
          offeredItemId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create swap request');
      }

      toast.success('Swap request sent successfully');
      fetchSwapRequests();
    } catch (error) {
      toast.error('Failed to send swap request');
      console.error('Error sending swap request:', error);
    }
  };

  const handleSwapResponse = async (requestId: string, accept: boolean) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/swap-requests/${requestId}/${accept ? 'accept' : 'reject'}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to respond to swap request');
      }

      toast.success(`Swap request ${accept ? 'accepted' : 'rejected'} successfully`);
      fetchSwapRequests();
      fetchItems();
    } catch (error) {
      toast.error('Failed to respond to swap request');
      console.error('Error responding to swap request:', error);
    }
  };

  const filteredItems = items.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.condition.length > 0 && !filters.condition.includes(item.condition)) return false;
    if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (item.user.rating < filters.minRating) return false;
    return true;
  });

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
        <h1 className="text-3xl font-bold">Save & Swap</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[300px]"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FaFilter /> Filters
          </Button>
          <Button
            onClick={() => router.push('/save-swap/add')}
            className="flex items-center gap-2"
          >
            <FaPlus /> Add Item
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Condition</Label>
              <div className="space-y-2 mt-2">
                {['new', 'like-new', 'good', 'fair', 'poor'].map((condition) => (
                  <div key={condition} className="flex items-center gap-2">
                    <Checkbox
                      id={condition}
                      checked={filters.condition.includes(condition)}
                      onCheckedChange={(checked: boolean) => {
                        setFilters({
                          ...filters,
                          condition: checked
                            ? [...filters.condition, condition]
                            : filters.condition.filter(c => c !== condition),
                        });
                      }}
                    />
                    <Label htmlFor={condition} className="capitalize">
                      {condition.replace('-', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="Enter location"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Minimum Rating</Label>
              <Slider
                value={[filters.minRating]}
                onValueChange={([value]: number[]) => setFilters({ ...filters, minRating: value })}
                min={0}
                max={5}
                step={0.5}
                className="mt-2"
              />
              <div className="text-sm text-gray-500 mt-1">
                {filters.minRating} stars
              </div>
            </div>
            <div>
              <Label>Maximum Distance (km)</Label>
              <Slider
                value={[filters.maxDistance]}
                onValueChange={([value]: number[]) => setFilters({ ...filters, maxDistance: value })}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
              <div className="text-sm text-gray-500 mt-1">
                {filters.maxDistance} km
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="browse">Browse Items</TabsTrigger>
          <TabsTrigger value="requests">Swap Requests</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === 'browse' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={item.images[0] || '/placeholder-item.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => handleToggleFavorite(item.id)}
                  >
                    {item.isFavorite ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-500" />
                    )}
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{item.location}</span>
                      <span className="mx-2">•</span>
                      <span>Condition: {item.condition}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <FaStar className="text-yellow-400" />
                      <span>{item.user.rating} ({item.user.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Listed by {item.user.name}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedChat(item.userId);
                          setShowChat(true);
                        }}
                      >
                        <FaComments />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedItem(item)}
                            className="flex items-center gap-2"
                          >
                            <FaExchangeAlt /> Swap
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Swap with {item.title}</DialogTitle>
                            <DialogDescription>
                              Select an item from your collection to offer in exchange for this item.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="text-sm text-gray-500">
                              Select an item to offer in exchange:
                            </div>
                            <div className="space-y-2">
                              {items
                                .filter((i) => String(i.userId) === String(user?.id) && i.status === 'available')
                                .map((offeredItem) => (
                                  <div
                                    key={offeredItem.id}
                                    className="flex items-center gap-4 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleSwapRequest(item.id, offeredItem.id)}
                                  >
                                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                                      <Image
                                        src={offeredItem.images[0] || '/placeholder-item.jpg'}
                                        alt={offeredItem.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="font-medium">{offeredItem.title}</div>
                                      <div className="text-sm text-gray-500">
                                        Condition: {offeredItem.condition}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : activeTab === 'favorites' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.filter(item => item.isFavorite).map((item) => (
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
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{item.location}</span>
                      <span className="mx-2">•</span>
                      <span>Condition: {item.condition}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <FaStar className="text-yellow-400" />
                      <span>{item.user.rating} ({item.user.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Listed by {item.user.name}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleFavorite(item.id)}
                      >
                        {item.isFavorite ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className="text-gray-500" />
                        )}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedItem(item)}
                            className="flex items-center gap-2"
                          >
                            <FaExchangeAlt /> Swap
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Swap with {item.title}</DialogTitle>
                            <DialogDescription>
                              Select an item from your collection to offer in exchange for this item.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="text-sm text-gray-500">
                              Select an item to offer in exchange:
                            </div>
                            <div className="space-y-2">
                              {items
                                .filter((i) => String(i.userId) === String(user?.id) && i.status === 'available')
                                .map((offeredItem) => (
                                  <div
                                    key={offeredItem.id}
                                    className="flex items-center gap-4 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleSwapRequest(item.id, offeredItem.id)}
                                  >
                                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                                      <Image
                                        src={offeredItem.images[0] || '/placeholder-item.jpg'}
                                        alt={offeredItem.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="font-medium">{offeredItem.title}</div>
                                      <div className="text-sm text-gray-500">
                                        Condition: {offeredItem.condition}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : activeTab === 'history' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemHistory.map((item) => (
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
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{item.location}</span>
                      <span className="mx-2">•</span>
                      <span>Condition: {item.condition}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <FaStar className="text-yellow-400" />
                      <span>{item.user.rating} ({item.user.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Listed by {item.user.name}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleFavorite(item.id)}
                      >
                        {item.isFavorite ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className="text-gray-500" />
                        )}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedItem(item)}
                            className="flex items-center gap-2"
                          >
                            <FaExchangeAlt /> Swap
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Swap with {item.title}</DialogTitle>
                            <DialogDescription>
                              Select an item from your collection to offer in exchange for this item.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="text-sm text-gray-500">
                              Select an item to offer in exchange:
                            </div>
                            <div className="space-y-2">
                              {items
                                .filter((i) => String(i.userId) === String(user?.id) && i.status === 'available')
                                .map((offeredItem) => (
                                  <div
                                    key={offeredItem.id}
                                    className="flex items-center gap-4 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleSwapRequest(item.id, offeredItem.id)}
                                  >
                                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                                      <Image
                                        src={offeredItem.images[0] || '/placeholder-item.jpg'}
                                        alt={offeredItem.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="font-medium">{offeredItem.title}</div>
                                      <div className="text-sm text-gray-500">
                                        Condition: {offeredItem.condition}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {swapRequests.length > 0 ? (
            swapRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Your Item</h3>
                      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                        <Image
                          src={request.offeredItem.images[0] || '/placeholder-item.jpg'}
                          alt={request.offeredItem.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium">{request.offeredItem.title}</div>
                        <div className="text-sm text-gray-500">
                          Condition: {request.offeredItem.condition}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Requested Item</h3>
                      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                        <Image
                          src={request.item.images[0] || '/placeholder-item.jpg'}
                          alt={request.item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium">{request.item.title}</div>
                        <div className="text-sm text-gray-500">
                          Condition: {request.item.condition}
                        </div>
                        <div className="text-sm text-gray-500">
                          Owner: {request.item.user.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t mt-4">
                    <div className="text-sm text-gray-500">
                      Requested on {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      {request.status === 'pending' && String(request.item.userId) === String(user?.id) && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => handleSwapResponse(request.id, true)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleSwapResponse(request.id, false)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {request.status !== 'pending' && (
                        <div className={`font-semibold ${
                          request.status === 'accepted' ? 'text-green-500' :
                          request.status === 'rejected' ? 'text-red-500' :
                          'text-blue-500'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">No swap requests found</h3>
              <p className="text-gray-500">
                You haven't made or received any swap requests yet.
              </p>
              <Button
                className="mt-4"
                onClick={() => setActiveTab('browse')}
              >
                Browse Items
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Chat</DialogTitle>
            <DialogDescription>
              Send messages to other users about swap requests and negotiations.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${String(message.senderId) === String(user?.id) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    String(message.senderId) === String(user?.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">
                    {message.sender.name}
                  </div>
                  <div>{message.content}</div>
                  <div className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
