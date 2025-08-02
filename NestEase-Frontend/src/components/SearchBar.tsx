'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

const SearchBar = ({ className = '', placeholder = 'Search properties, services, or items...' }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className={`w-full ${className}`}>
      <div className={`relative flex items-center w-full rounded-lg border transition-colors ${
        isFocused 
          ? 'border-blue-500 bg-white dark:bg-gray-800' 
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
      }`}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <FiSearch size={20} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 