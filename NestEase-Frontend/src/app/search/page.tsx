'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiHome, FiTool, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';

interface SearchResult {
  id: number;
  title: string;
  category: string;
  type: 'property' | 'service' | 'item';
  description: string;
  price?: number;
  location?: string;
  image?: string;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'property' | 'service' | 'item'>('all');

  useEffect(() => {
    if (query) {
      // Simulate API call with mock data
      setLoading(true);
      setTimeout(() => {
        const mockResults: SearchResult[] = [
          {
            id: 1,
            title: 'Modern Apartment in City Center',
            category: 'Apartment',
            type: 'property',
            description: 'Beautiful 2-bedroom apartment with modern amenities',
            price: 25000,
            location: 'Dhaka',
            image: '/images/property1.jpg'
          },
          {
            id: 2,
            title: 'Professional Cleaning Service',
            category: 'Home Cleaning',
            type: 'service',
            description: 'Expert cleaning services for your home',
            price: 1500,
            location: 'Dhaka'
          },
          {
            id: 3,
            title: 'Samsung Smart TV 55"',
            category: 'Electronics',
            type: 'item',
            description: 'Like new condition, barely used',
            price: 45000,
            location: 'Dhaka'
          }
        ];
        setResults(mockResults);
        setLoading(false);
      }, 1000);
    }
  }, [query]);

  const filteredResults = results.filter(result => 
    activeTab === 'all' || result.type === activeTab
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <FiHome className="text-blue-500" />;
      case 'service':
        return <FiTool className="text-green-500" />;
      case 'item':
        return <FiShoppingBag className="text-purple-500" />;
      default:
        return null;
    }
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Search</h1>
          <p className="text-gray-600 dark:text-gray-400">Enter a search term to find properties, services, or items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Search Results for "{query}"
        </h1>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8">
          {['all', 'property', 'service', 'item'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No results found for your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                {result.image && (
                  <div className="relative h-48">
                    <img
                      src={result.image}
                      alt={result.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    {getIcon(result.type)}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {result.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {result.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {result.description}
                  </p>
                  {result.price && (
                    <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                      ৳{result.price.toLocaleString()}
                    </p>
                  )}
                  {result.location && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {result.location}
                    </p>
                  )}
                  <Link
                    href={`/${result.type}s/${result.id}`}
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 