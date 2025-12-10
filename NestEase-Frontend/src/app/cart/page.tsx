'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaTrash, FaExchangeAlt, FaMapMarkerAlt, FaUser, FaShoppingBag, FaMinus, FaPlus, FaBookmark, FaUndo, FaTools, FaHome } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';

interface Owner {
  name: string;
  rating: number;
  swaps: number;
}

interface CartItem {
  id: number;
  title?: string;
  product_name?: string;
  category?: string;
  price: number;
  condition?: string;
  product_condition?: string;
  description?: string;
  imageBg?: string;
  icon?: string;
  owner?: Owner | { name: string };
  owner_name?: string;
  location?: string;
  swapValue?: number;
  quantity?: number;
  images?: string;
  imageUrl?: string;
  type?: 'sell' | 'offer' | 'service' | 'property';
  serviceType?: string;
  businessName?: string;
  propertyType?: string;
  address?: string;
}

const CartPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, getTotalAmount, clearCart } = useCart();
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved items from localStorage
  useEffect(() => {
    const storedSavedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
    setSavedItems(storedSavedItems);
  }, []);

  const saveForLater = (item: CartItem) => {
    removeFromCart(item.id);
    const updatedSavedItems = [...savedItems, item];
    localStorage.setItem('savedItems', JSON.stringify(updatedSavedItems));
    setSavedItems(updatedSavedItems);
  };

  const moveToCart = (item: CartItem) => {
    const updatedSavedItems = savedItems.filter(savedItem => savedItem.id !== item.id);
    localStorage.setItem('savedItems', JSON.stringify(updatedSavedItems));
    setSavedItems(updatedSavedItems);
    // Note: We can't add back to cart here since we need the cart context
    // This would need to be handled differently
  };

  const handleContinueShopping = () => {
    router.push('/barter');
  };

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    // Navigate to checkout page
    router.push('/checkout');
  };

  const getItemIcon = (item: CartItem) => {
    switch (item.type) {
      case 'service':
        return <FaTools className="text-blue-600" />;
      case 'property':
        return <FaHome className="text-green-600" />;
      default:
        return <FaShoppingBag className="text-purple-600" />;
    }
  };

  const getItemTypeLabel = (item: CartItem) => {
    switch (item.type) {
      case 'service':
        return 'Service';
      case 'property':
        return 'Property';
      case 'offer':
        return 'Offer';
      default:
        return 'Product';
    }
  };

  if (cartItems.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-foreground hover:text-primary transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Listings
            </button>
          </div>
          <div className="bg-card rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-card-foreground mb-2">Your Cart is Empty</h2>
            <p className="text-muted-foreground mb-6">Add some items to your cart to see them here</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/barter"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Items
              </Link>
              <Link
                href="/services"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-foreground hover:text-primary transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Listings
          </button>
          <h1 className="text-2xl font-bold text-foreground">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Cart Items</h2>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-lg overflow-hidden"
                  >
                    <div className="flex">
                      <div className="w-32 relative h-32">
                        <Image
                          src={item.images || item.imageUrl || '/placeholder.jpg'}
                          alt={item.product_name || item.title || 'Item Image'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getItemIcon(item)}
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                {getItemTypeLabel(item)}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-card-foreground mb-1">
                              {item.product_name || item.title || item.businessName}
                            </h3>
                            {item.serviceType && (
                              <p className="text-sm text-muted-foreground mb-1">Service: {item.serviceType}</p>
                            )}
                            {item.owner_name && (
                              <p className="text-sm text-muted-foreground mb-1">By: {item.owner_name}</p>
                            )}
                            {item.location && (
                              <p className="text-sm text-muted-foreground mb-1 flex items-center">
                                <FaMapMarkerAlt className="mr-1" />
                                {item.location}
                              </p>
                            )}
                            <div className="text-xl font-bold text-card-foreground">
                              ৳{item.price}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                              className="p-1 rounded-full hover:bg-accent"
                            >
                              <FaMinus className="text-muted-foreground" />
                            </button>
                            <span className="text-card-foreground">{item.quantity || 1}</span>
                            <button
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="p-1 rounded-full hover:bg-accent"
                            >
                              <FaPlus className="text-muted-foreground" />
                            </button>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveForLater(item)}
                              className="p-2 text-muted-foreground hover:text-primary"
                            >
                              <FaBookmark />
                            </button>
                            <button
                              onClick={() => setShowRemoveConfirm(item.id)}
                              className="p-2 text-muted-foreground hover:text-destructive"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Saved Items */}
            {savedItems.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground mb-4">Saved for Later</h2>
                {savedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-lg overflow-hidden"
                  >
                    <div className="flex">
                      <div className="w-32 relative h-32">
                        <Image
                          src={item.images || item.imageUrl || '/placeholder.jpg'}
                          alt={item.product_name || item.title || 'Item Image'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getItemIcon(item)}
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                {getItemTypeLabel(item)}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-card-foreground mb-1">
                              {item.product_name || item.title || item.businessName}
                            </h3>
                            {item.serviceType && (
                              <p className="text-sm text-muted-foreground mb-1">Service: {item.serviceType}</p>
                            )}
                            {item.owner_name && (
                              <p className="text-sm text-muted-foreground mb-1">By: {item.owner_name}</p>
                            )}
                            {item.location && (
                              <p className="text-sm text-muted-foreground mb-1 flex items-center">
                                <FaMapMarkerAlt className="mr-1" />
                                {item.location}
                              </p>
                            )}
                            <div className="text-xl font-bold text-card-foreground">
                              ৳{item.price}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => moveToCart(item)}
                              className="p-2 text-muted-foreground hover:text-primary"
                            >
                              <FaUndo />
                            </button>
                            <button
                              onClick={() => {
                                const updatedSavedItems = savedItems.filter(savedItem => savedItem.id !== item.id);
                                localStorage.setItem('savedItems', JSON.stringify(updatedSavedItems));
                                setSavedItems(updatedSavedItems);
                              }}
                              className="p-2 text-muted-foreground hover:text-destructive"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-card-foreground">৳{getTotalAmount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-semibold text-card-foreground">৳0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-card-foreground">৳0</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-card-foreground">Total</span>
                    <span className="text-card-foreground">৳{getTotalAmount()}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-muted disabled:cursor-not-allowed transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="w-full bg-muted text-muted-foreground py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  Continue Shopping
                </button>
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Remove Confirmation Modal */}
        <AnimatePresence>
          {showRemoveConfirm !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-card rounded-lg p-6 max-w-sm w-full"
              >
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Remove Item</h3>
                <p className="text-muted-foreground mb-6">Are you sure you want to remove this item from your cart?</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowRemoveConfirm(null)}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      removeFromCart(showRemoveConfirm);
                      setShowRemoveConfirm(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartPage; 
