import React from 'react';
import Image from 'next/image';

interface CartItem {
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

interface CartProps {
  items: CartItem[];
  onRemoveItem: (id: number) => void;
  onViewDetails: (item: CartItem) => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemoveItem, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-600 text-center py-4">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
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
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewDetails(item)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
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
  );
};

export default Cart; 