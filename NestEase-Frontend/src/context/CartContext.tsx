'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  product_name?: string;
  title?: string;
  name?: string;
  price: number;
  discount?: number;
  images?: string;
  imageUrl?: string;
  image?: string;
  type?: 'sell' | 'offer' | 'service' | 'property';
  quantity?: number;
  owner_name?: string;
  owner?: {
    name: string;
  };
  // Additional properties for different item types
  serviceType?: string;
  businessName?: string;
  propertyType?: string;
  location?: string;
  address?: string;
  // Service booking specific properties
  serviceBooking?: {
    id: number;
    service: {
      id: number;
      businessName: string;
      serviceType: string;
      images?: string[];
    };
    date: string;
    time: string;
    status: string;
    address: string;
    notes: string;
    duration?: number;
    totalAmount?: number;
    paymentStatus?: string;
    paymentMethod?: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  isInCart: (itemId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedItems);
    setCartCount(storedItems.length);
  }, []);

  // Save cart items to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setCartCount(cartItems.length);
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // If item exists, update quantity
        const updatedItems = prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
        toast.success('Item quantity updated in cart');
        return updatedItems;
      } else {
        // If item doesn't exist, add it with quantity 1
        const newItem = { ...item, quantity: 1 };
        toast.success('Item added to cart');
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== itemId);
      toast.success('Item removed from cart');
      return updatedItems;
    });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount 
        ? item.price - (item.price * item.discount / 100)
        : item.price;
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  const isInCart = (itemId: number) => {
    return cartItems.some(item => item.id === itemId);
  };

  const value: CartContextType = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalAmount,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 