'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaSearch, FaFilter, FaTrash, FaEye, FaEdit, FaPlus, FaExchangeAlt, FaShoppingCart, FaGift } from 'react-icons/fa';
import { getImageUrl, handleImageError } from '@/lib/utils';

interface SwapItem {
  id: number;
  title?: string;
  product_name?: string;
  description: string;
  category: string;
  location: string;
  item_condition?: string;
  product_condition?: string;
  price?: number;
  discount?: number;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  images?: string;
  created_at?: string;
  createdAt?: string;
}

interface Stats {
  totalItems: number;
  totalSwapItems: number;
  totalSellProducts: number;
  totalItemOffers: number;
}

export default function AdminSaveAndSwapPage() {
  const [swapItems, setSwapItems] = useState<SwapItem[]>([]);
  const [sellProducts, setSellProducts] = useState<SwapItem[]>([]);
  const [itemOffers, setItemOffers] = useState<SwapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'swap' | 'sell' | 'offer'>('swap');
  const [stats, setStats] = useState<Stats>({
    totalItems: 0,
    totalSwapItems: 0,
    totalSellProducts: 0,
    totalItemOffers: 0,
  });

  const categories = [
    'electronics', 'furniture', 'vehicles', 'clothing', 'books', 'sports', 
    'music', 'tools', 'services', 'rentals', 'repairs', 'cleaning', 
    'gardening', 'cooking', 'transport', 'smartphone', 'car', 'dress', 
    'bike', 'laptop', 'tablet', 'motorcycle', 'house', 'kitchen'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    fetchAllData();
    // Test the barter stats endpoint
    testBarterStats();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const headers = {
          Authorization: `Bearer ${token}`,
      };

      // Fetch all three types of items
      const [swapResponse, sellResponse, offerResponse] = await Promise.all([
        fetch('${process.env.NEXT_PUBLIC_API_URL}/admin/add-swap-items', { headers }),
        fetch('${process.env.NEXT_PUBLIC_API_URL}/admin/sell-products', { headers }),
        fetch('${process.env.NEXT_PUBLIC_API_URL}/admin/item-offers', { headers }),
      ]);

      let swapData = [];
      let sellData = [];
      let offerData = [];

      if (swapResponse.ok) {
        swapData = await swapResponse.json();
        setSwapItems(swapData);
        console.log('Swap items fetched:', swapData.length);
      } else {
        console.error('Failed to fetch swap items:', swapResponse.status, swapResponse.statusText);
      }

      if (sellResponse.ok) {
        sellData = await sellResponse.json();
        setSellProducts(sellData);
        console.log('Sell products fetched:', sellData.length);
      } else {
        console.error('Failed to fetch sell products:', sellResponse.status, sellResponse.statusText);
      }

      if (offerResponse.ok) {
        offerData = await offerResponse.json();
        setItemOffers(offerData);
        console.log('Item offers fetched:', offerData.length);
      } else {
        console.error('Failed to fetch item offers:', offerResponse.status, offerResponse.statusText);
      }

      // Update stats using the stored data
      setStats({
        totalItems: swapData.length + sellData.length + offerData.length,
        totalSwapItems: swapData.length,
        totalSellProducts: sellData.length,
        totalItemOffers: offerData.length,
      });

    } catch (error) {
      toast.error('Failed to load items. Please try again later.');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const testBarterStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/admin/barter-stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const stats = await response.json();
        console.log('Barter stats from backend:', stats);
      } else {
        console.error('Failed to fetch barter stats:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error testing barter stats:', error);
    }
  };

  const handleDelete = async (id: number, type: 'swap' | 'sell' | 'offer') => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'swap' ? 'add-swap-items' : 
                      type === 'sell' ? 'sell-products' : 'item-offers';
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to delete item');
      
      toast.success('Item deleted successfully');
      fetchAllData(); // Refresh all data
    } catch (error) {
      toast.error('Failed to delete item');
      console.error('Error deleting item:', error);
    }
  };

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'swap': return swapItems;
      case 'sell': return sellProducts;
      case 'offer': return itemOffers;
      default: return swapItems;
    }
  };

  const filteredItems = getCurrentItems()
    .filter((item) => {
      const title = item.title || item.product_name || '';
      const matchesSearch = 
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.owner_name && item.owner_name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const condition = item.item_condition || item.product_condition || '';
      const matchesCondition = selectedCondition ? condition === selectedCondition : true;
      
      return matchesSearch && matchesCategory && matchesCondition;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof SwapItem];
      const bValue = b[sortBy as keyof SwapItem];
      
      if (aValue === undefined || bValue === undefined) {
        return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getItemIcon = (type: 'swap' | 'sell' | 'offer') => {
    switch (type) {
      case 'swap': return <FaExchangeAlt className="text-blue-500" />;
      case 'sell': return <FaShoppingCart className="text-green-500" />;
      case 'offer': return <FaGift className="text-purple-500" />;
    }
  };

  const getItemTypeLabel = (type: 'swap' | 'sell' | 'offer') => {
    switch (type) {
      case 'swap': return 'Swap Item';
      case 'sell': return 'Sell Product';
      case 'offer': return 'Item Offer';
    }
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) {
      return '/images/placeholder.jpg';
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, make it absolute
    if (imagePath.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;
    }
    
    // If it's just a filename, construct the full path
    const uploadPath = activeTab === 'swap' ? 'swaps' : activeTab === 'sell' ? 'products' : 'products';
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${uploadPath}/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Barter Items Management</h1>
          <p className="text-muted-foreground">Manage all barter items, sell products, and item offers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-lg shadow p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaExchangeAlt className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaExchangeAlt className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Swap Items</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalSwapItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FaShoppingCart className="text-orange-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Sell Products</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalSellProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaGift className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Item Offers</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalItemOffers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-lg shadow mb-6 border">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'swap', label: 'Swap Items', count: stats.totalSwapItems },
                { id: 'sell', label: 'Sell Products', count: stats.totalSellProducts },
                { id: 'offer', label: 'Item Offers', count: stats.totalItemOffers },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'swap' | 'sell' | 'offer')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-secondary text-secondary-foreground py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-lg shadow p-6 mb-6 border">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
            >
              <option value="">All Conditions</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
            >
              <option value="created_at">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="category">Sort by Category</option>
              <option value="location">Sort by Location</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-card rounded-lg shadow overflow-hidden border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center">
                        {getItemIcon(activeTab)}
                        <p className="mt-2 text-lg font-medium">No {getItemTypeLabel(activeTab).toLowerCase()}s found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {item.images ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={getImageUrl(item.images)}
                                alt={item.title || item.product_name}
                                onError={(e) => {
                                  // Hide the image if it fails to load
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                {getItemIcon(activeTab)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-foreground">
                              {item.title || item.product_name}
                            </div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">{item.owner_name}</div>
                        <div className="text-sm text-muted-foreground">{item.owner_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {item.price ? (
                          <div>
                            <span className="font-medium">৳{item.price.toLocaleString()}</span>
                            {item.discount && (
                              <span className="ml-2 text-green-600 text-xs">
                                -{item.discount}%
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(item.created_at || item.createdAt || '').toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(item.id, activeTab)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Showing {filteredItems.length} of {getCurrentItems().length} {getItemTypeLabel(activeTab).toLowerCase()}s
        </div>
      </div>
    </div>
  );
} 
