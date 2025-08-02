'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Cart from '../../components/Cart';
import { toast } from 'react-hot-toast';

// Add this interface near the top of the file with other interfaces
interface ItemOffer {
  id: number;
  owner_name: string;
  product_name: string;
  price: number;
  discount: number;
  category: string;
  product_condition: string;
  location: string;
  description: string;
  images: string;
  created_at: string;
}

// Update the form data interface
interface FormData {
  owner_name: string;
  product_name: string;
  price: string;
  discount: string;
  category: string;
  product_condition: string;
  location: string;
  description: string;
  images: string;
  phone?: string;
  email?: string;
}

// Add this state near other state declarations
const [offers, setOffers] = useState<ItemOffer[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [selectedTransactionType, setSelectedTransactionType] = useState<string>('buy');
const [selectedOffer, setSelectedOffer] = useState<ItemOffer | null>(null);
const [showModal, setShowModal] = useState(false);
const [formData, setFormData] = useState<FormData>({
  owner_name: '',
  product_name: '',
  price: '',
  discount: '',
  category: '',
  product_condition: '',
  location: '',
  description: '',
  images: '',
  phone: '',
  email: ''
});

// Add this state for cart items
const [cartItems, setCartItems] = useState<ItemOffer[]>([]);

// Add this state near other state declarations
const [selectedCategory, setSelectedCategory] = useState<string>('');

// Add this state for selected cart item
const [selectedCartItem, setSelectedCartItem] = useState<ItemOffer | null>(null);

useEffect(() => {
  console.log('Component mounted, fetching offers...');
  fetchOffers();
}, []);

// Update the fetchOffers function to handle category filtering
const fetchOffers = async () => {
  try {
    setLoading(true);
    console.log('Starting to fetch offers...');
    const response = await fetch(`http://localhost:3001/add-offer${selectedCategory ? `?category=${selectedCategory}` : ''}`);
    console.log('API Response status:', response.status);
    const data = await response.json();
    console.log('Received data from API:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('Setting offers:', data.data);
      setOffers(data.data);
    } else {
      console.error('Error in API response:', data.message);
      setError(data.message || 'Failed to fetch offers');
    }
  } catch (err) {
    console.error('Error fetching offers:', err);
    setError('Failed to fetch offers');
  } finally {
    setLoading(false);
  }
};

// Add useEffect to refetch offers when category changes
useEffect(() => {
  if (selectedTransactionType === 'offer') {
    fetchOffers();
  }
}, [selectedCategory, selectedTransactionType]);

// Update the handleAddToCart function
const handleAddToCart = (offer: ItemOffer) => {
  console.log('Adding to cart:', offer);
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  const isInCart = cartItems.some((item: any) => item.id === offer.id);
  
  if (!isInCart) {
    const newItem = {
      ...offer,
      type: 'offer'
    };
    const newCartItems = [...cartItems, newItem];
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    setCartItems(newCartItems);
    toast.success('Item added to cart');
  }
};

// Update the handleRemoveFromCart function
const handleRemoveFromCart = (id: number) => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  const updatedCart = cartItems.filter((item: any) => item.id !== id);
  localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  setCartItems(updatedCart);
  toast.success('Item removed from cart');
};

// Add this useEffect to sync cart items with localStorage
useEffect(() => {
  const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  setCartItems(storedCartItems);
}, []);

// Add this function to handle view details
const handleViewDetails = (offer: ItemOffer) => {
  setSelectedOffer(offer);
  setShowModal(true);
};

const closeModal = () => {
  setShowModal(false);
  setSelectedOffer(null);
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

// Update the handleExchangeSubmit function
const handleExchangeSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!selectedCartItem) {
    toast.error('Please select an item from your cart first');
    return;
  }

  const loadingToast = toast.loading('Creating exchange offer...');

  try {
    // First upload the image if there is one
    let imageUrl = '';
    if (formData.images) {
      const imageFormData = new FormData();
      imageFormData.append('file', formData.images);
      
      const imageResponse = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: imageFormData,
      });

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json();
        toast.dismiss(loadingToast);
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const imageResult = await imageResponse.json();
      imageUrl = imageResult.imageUrl;
    }

    // Then create the exchange product
    const response = await fetch('http://localhost:3001/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        yourName: formData.owner_name,
        yourPhone: formData.phone || '',
        yourEmail: formData.email || '',
        productName: formData.product_name,
        category: formData.category,
        itemCondition: formData.product_condition,
        location: formData.location,
        description: formData.description,
        images: imageUrl,
        swapId: selectedCartItem.id
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.dismiss(loadingToast);
      throw new Error(errorData.message || 'Failed to create exchange offer');
    }

    const result = await response.json();
    toast.dismiss(loadingToast);
    toast.success('Exchange offer created successfully!');
    
    // Reset form and selected cart item
    setFormData({
      owner_name: '',
      product_name: '',
      price: '',
      discount: '',
      category: '',
      product_condition: '',
      location: '',
      description: '',
      images: '',
      phone: '',
      email: ''
    });
    setSelectedCartItem(null);
    
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error(error instanceof Error ? error.message : 'Failed to create exchange offer');
    console.error('Error creating exchange offer:', error);
  }
};

// Add this function to handle cart item selection
const handleSelectCartItem = (item: ItemOffer) => {
  setSelectedCartItem(item);
  toast.success(`Selected ${item.product_name} for exchange`);
};

export default function BarterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Transaction Type Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Select Transaction Type</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedTransactionType('buy')}
            className={`px-6 py-3 rounded-lg ${
              selectedTransactionType === 'buy'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setSelectedTransactionType('sell')}
            className={`px-6 py-3 rounded-lg ${
              selectedTransactionType === 'sell'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Cart Section */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Your Cart ({cartItems.length} items)</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-600 text-center py-4">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-4">
                      {item.images && (
                        <div className="relative h-24 w-24">
                          <Image
                            src={item.images}
                            alt={item.product_name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{item.product_name}</h3>
                        <p className="text-sm text-gray-600">By {item.owner_name}</p>
                        <p className="text-sm text-gray-600">Location: {item.location}</p>
                        <p className="text-sm text-gray-600">Condition: {item.product_condition}</p>
                        <div className="flex items-center">
                          <span className="text-xl font-bold">৳{item.price}</span>
                          {item.discount > 0 && (
                            <span className="ml-2 text-sm text-green-600">
                              {item.discount}% off
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleSelectCartItem(item)}
                        className={`px-3 py-1 ${
                          selectedCartItem?.id === item.id
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-600 text-white'
                        } rounded hover:bg-opacity-90 transition-colors text-sm`}
                      >
                        {selectedCartItem?.id === item.id ? 'Selected' : 'Select for Exchange'}
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Select a Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Electronics', 'Furniture', 'Clothing', 'Books', 'Rentals', 'Services', 'Repairs', 'Cleaning'].map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(selectedCategory === category ? '' : category);
                if (selectedTransactionType === 'offer') {
                  fetchOffers();
                }
              }}
              className={`p-4 rounded-lg shadow transition-shadow ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white hover:shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Offer Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          {selectedCategory ? `${selectedCategory} Offers` : 'All Item Offers'}
        </h2>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading item offers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-600">
            <p>{error}</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-4 text-gray-600">
            <p>No item offers available for {selectedCategory || 'this category'}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(
              offers.reduce((acc, offer) => {
                if (!acc[offer.category]) {
                  acc[offer.category] = [];
                }
                acc[offer.category].push(offer);
                return acc;
              }, {} as Record<string, typeof offers>)
            ).map(([category, categoryOffers]) => (
              <div key={category} className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-xl font-semibold">{category}</h3>
                  <span className="text-sm text-gray-600">
                    {categoryOffers.length} items
                  </span>
                </div>

                {/* Cart Items for this Category */}
                {cartItems.filter(item => item.category.toLowerCase() === category.toLowerCase()).length > 0 && (
                  <div className="mb-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium mb-3">Your Cart Items in {category}</h4>
                    <div className="space-y-3">
                      {cartItems
                        .filter(item => item.category.toLowerCase() === category.toLowerCase())
                        .map((item) => (
                          <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex items-center space-x-3">
                              {item.images && (
                                <div className="relative h-16 w-16">
                                  <Image
                                    src={item.images}
                                    alt={item.product_name}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                </div>
                              )}
                              <div>
                                <h5 className="font-medium">{item.product_name}</h5>
                                <p className="text-sm text-gray-600">৳{item.price}</p>
                                <p className="text-sm text-gray-600">By {item.owner_name}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Available Items in this Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryOffers.map((offer) => (
                    <div key={offer.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      {offer.images && (
                        <div className="relative h-48 mb-4">
                          <Image
                            src={offer.images}
                            alt={offer.product_name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{offer.product_name}</h3>
                          <p className="text-sm text-gray-600">By {offer.owner_name}</p>
                          <p className="text-sm text-gray-600">Location: {offer.location}</p>
                          <p className="text-sm text-gray-600">Condition: {offer.product_condition}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold">৳{offer.price}</span>
                            {offer.discount > 0 && (
                              <span className="ml-2 text-sm text-green-600">
                                {offer.discount}% off
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(offer)}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleAddToCart(offer)}
                              className={`px-4 py-2 rounded transition-colors ${
                                cartItems.some(item => item.id === offer.id)
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              {cartItems.some(item => item.id === offer.id) ? 'In Cart' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Offer Form */}
      {selectedTransactionType === 'sell' && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Add Your Offer</h2>
          <form onSubmit={handleExchangeSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner Name</label>
              <input
                type="text"
                name="owner_name"
                value={formData.owner_name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Condition</label>
              <input
                type="text"
                name="product_condition"
                value={formData.product_condition}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Images (comma-separated URLs)</label>
              <input
                type="text"
                name="images"
                value={formData.images}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Offer
            </button>
          </form>
        </div>
      )}

      {/* Modal for View Details */}
      {showModal && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedOffer.product_name}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {selectedOffer.images && (
              <div className="relative h-64 mb-4">
                <Image
                  src={selectedOffer.images}
                  alt={selectedOffer.product_name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <div className="space-y-4">
              <p><strong>Owner:</strong> {selectedOffer.owner_name}</p>
              {selectedTransactionType !== 'swap' && (
                <>
                  <p><strong>Price:</strong> ৳{selectedOffer.price}</p>
                  {selectedOffer.discount > 0 && (
                    <p><strong>Discount:</strong> {selectedOffer.discount}%</p>
                  )}
                </>
              )}
              <p><strong>Category:</strong> {selectedOffer.category}</p>
              <p><strong>Condition:</strong> {selectedOffer.product_condition}</p>
              <p><strong>Location:</strong> {selectedOffer.location}</p>
              <p><strong>Description:</strong> {selectedOffer.description}</p>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAddToCart(selectedOffer);
                  closeModal();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 