'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaStar, FaExchangeAlt, FaMapMarkerAlt, FaUser, FaClock, FaThumbsUp, FaThumbsDown, FaComment, FaShare, FaHeart, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Owner {
  name: string;
  rating: number;
  swaps: number;
  id: number;
}

interface BarterItem {
  id: number;
  title: string;
  category: string;
  price: number;
  condition: string;
  description: string;
  imageBg: string;
  icon: string;
  owner: Owner;
  location: string;
  swapValue: number;
  discount?: number;
}

// Import the barterItems array from the data file
import { barterItems } from '@/data/data';

const ItemDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<BarterItem | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Get the previous path from sessionStorage
  useEffect(() => {
    if (params?.id) {
      const foundItem = barterItems.find(item => item.id === Number(params.id));
      if (foundItem) {
        setItem(foundItem as any);
        // Check if item is in cart
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        setIsInCart(cartItems.some((cartItem: BarterItem) => cartItem.id === foundItem.id));
      }
    }
  }, [params?.id]);

  const handleBack = () => {
    // Get the stored state
    const storedState = sessionStorage.getItem('barterState');
    if (storedState) {
      const state = JSON.parse(storedState);
      // Construct the URL with the stored state
      let url = '/barter';
      if (state.transactionType && ['sell', 'buy', 'swap'].includes(state.transactionType)) {
        url += `?type=${state.transactionType}`;
        if (state.category) {
          url += `&category=${state.category}`;
        }
        if (state.searchTerm) {
          url += `&search=${encodeURIComponent(state.searchTerm)}`;
        }
        if (state.priceRange) {
          url += `&price=${state.priceRange}`;
        }
      }
      router.push(url);
    } else {
      router.push('/barter');
    }
  };

  const handleContactSeller = async () => {
    if (!item) {
      console.error('Item is null or undefined');
      return;
    }
    
    if (!message.trim()) {
      setShowErrorMessage(true);
      setErrorMessage('Please enter a message');
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }

    setIsSending(true);
    try {
      const requestData = {
        itemId: item.id,
        sellerId: item.owner.id,
        message: message.trim(),
        itemTitle: item.title,
        sellerName: item.owner.name,
      };

      console.log('Sending message with data:', requestData);

      const response = await fetch('/api/contact-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log('Received response:', data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to send message');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to send message');
      }

      setShowSuccessMessage(true);
      setMessage('');
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowContactModal(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setShowErrorMessage(true);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setErrorMessage(errorMessage);
      setTimeout(() => {
        setShowErrorMessage(false);
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsSending(false);
    }
  };

  const handleAddToCart = () => {
    if (item) {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      if (!isInCart) {
        cartItems.push(item);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        setIsInCart(true);
      } else {
        const updatedCartItems = cartItems.filter((cartItem: BarterItem) => cartItem.id !== item.id);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        setIsInCart(false);
      }
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <div className="bg-gray-900 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <button
              onClick={handleBack}
              className="flex items-center text-white hover:text-blue-400 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Listings
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`text-lg transition-colors ${
                  isLiked ? 'text-red-500' : 'text-white hover:text-red-500'
                }`}
              >
                <FaHeart />
              </button>
              <button className="text-lg text-white hover:text-blue-400 transition-colors">
                <FaShare />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Image and Gallery */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-lg overflow-hidden"
            >
              <div className={`h-96 ${item.imageBg} flex items-center justify-center`}>
                <motion.div 
                  className="text-8xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {item.icon}
                </motion.div>
              </div>
            </motion.div>

            {/* Item Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-gray-900 rounded-lg p-6"
            >
              <h1 className="text-2xl font-bold text-white mb-4">{item.title}</h1>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Condition</div>
                  <div className="text-white font-medium">{item.condition}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Location</div>
                  <div className="text-white font-medium">{item.location}</div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
                <p className="text-gray-300">{item.description}</p>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowContactModal(true)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Seller
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Handle swap functionality
                    const state = {
                      transactionType: 'swap',
                      category: item.category,
                      searchTerm: '',
                      priceRange: ''
                    };
                    sessionStorage.setItem('barterState', JSON.stringify(state));
                    router.push('/barter?type=swap');
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  <FaExchangeAlt />
                  <span>Swap</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Seller Info and Stats */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Seller Information</h2>
              
              <div className="flex items-center mb-6">
                <div className="bg-gray-800 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <div className="text-white font-medium">{item.owner.name}</div>
                  <div className="flex items-center text-yellow-400">
                    <FaStar className="mr-1" />
                    <span className="text-gray-300">{item.owner.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-300">
                  <FaExchangeAlt className="mr-2" />
                  <span>{item.owner.swaps} successful swaps</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <FaClock className="mr-2" />
                  <span>Member since 2023</span>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Seller Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">{item.owner.rating}</div>
                    <div className="text-sm text-gray-400">Rating</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">{item.owner.swaps}</div>
                    <div className="text-sm text-gray-400">Swaps</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">Contact Seller</h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="mb-4">
                <div className="text-gray-300 mb-2">Item Details</div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-white font-medium">{item.title}</div>
                  <div className="text-gray-400 text-sm">Seller: {item.owner.name}</div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {showSuccessMessage && (
                <div className="mb-4 p-3 bg-green-500 text-white rounded-lg">
                  Message sent successfully! The seller will contact you soon.
                </div>
              )}

              {showErrorMessage && (
                <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">
                  {errorMessage || 'Failed to send message. Please try again.'}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                  disabled={isSending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleContactSeller}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSending}
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailsPage; 