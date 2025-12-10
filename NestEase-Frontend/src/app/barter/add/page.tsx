'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaUpload, FaImage, FaTag, FaInfoCircle, FaMapMarkerAlt, FaExchangeAlt, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const transactionTypes = [
  { id: 'sell', name: 'Sell', icon: '💰' },
  { id: 'buy', name: 'Buy', icon: '🛍️' },
  { id: 'swap', name: 'Swap', icon: '🔄' },
  { id: 'offer', name: 'Offer', icon: '🎁' }
];

const categories = {
  sell: [
    { id: 'smartphone', name: 'Smartphone' },
    { id: 'car', name: 'Car' },
    { id: 'dress', name: 'Dress' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'bike', name: 'Bike' },
    { id: 'books', name: 'Books' },
    { id: 'laptop', name: 'Laptop' },
    { id: 'tablet', name: 'Tablet' },
    { id: 'motorcycle', name: 'Motorcycle' },
    { id: 'house', name: 'House' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'tools', name: 'Tools' }
  ],
  buy: [
    { id: 'electronics', name: 'Electronics' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'audio', name: 'Audio' },
    { id: 'camera', name: 'Camera' },
    { id: 'appliances', name: 'Appliances' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'bedroom', name: 'Bedroom' },
    { id: 'sports', name: 'Sports' },
    { id: 'music', name: 'Music' },
    { id: 'fitness', name: 'Fitness' }
  ],
  swap: [
    { id: 'electronics', name: 'Electronics' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'vehicles', name: 'Vehicles' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'books', name: 'Books' },
    { id: 'sports', name: 'Sports' },
    { id: 'music', name: 'Music' },
    { id: 'tools', name: 'Tools' }
  ],
  offer: [
    { id: 'services', name: 'Services' },
    { id: 'rentals', name: 'Rentals' },
    { id: 'repairs', name: 'Repairs' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'gardening', name: 'Gardening' },
    { id: 'cooking', name: 'Cooking' },
    { id: 'transport', name: 'Transport' }
  ]
};

const conditions = [
  { id: 'new', name: 'New' },
  { id: 'excellent', name: 'Excellent' },
  { id: 'very-good', name: 'Very Good' },
  { id: 'good', name: 'Good' },
  { id: 'fair', name: 'Fair' }
];

const getCategoryIcon = (categoryId: string) => {
  const icons: { [key: string]: string } = {
    smartphone: '📱',
    car: '🚗',
    dress: '👗',
    furniture: '🪑',
    bike: '🚲',
    books: '📚',
    laptop: '💻',
    tablet: '📱',
    motorcycle: '🏍️',
    house: '🏠',
    kitchen: '🍳',
    tools: '🔧',
    electronics: '📱',
    gaming: '🎮',
    audio: '🎧',
    camera: '📸',
    appliances: '🏠',
    bedroom: '🛏️',
    sports: '⚽',
    music: '🎵',
    fitness: '💪',
    vehicles: '🚗',
    clothing: '👕',
    services: '🧹',
    rentals: '🏠',
    repairs: '🔧',
    cleaning: '🧹',
    gardening: '🌿',
    cooking: '🍳',
    transport: '🚗'
  };
  return icons[categoryId] || '📦';
};

const AddItemPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    transactionType: '',
    category: '',
    title: '',
    description: '',
    price: '',
    condition: '',
    location: '',
    images: [] as File[],
    swapValue: '',
    discount: '',
    originalPrice: ''
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));

      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.transactionType || !formData.category || !formData.title || 
        !formData.description || !formData.price || !formData.condition || 
        !formData.location || formData.images.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          formDataToSend.append(key, value as string);
        }
      });

      // Add images separately
      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('/api/barter/add', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item');
      }

      setSuccess('Item added successfully!');
      setTimeout(() => {
        router.push('/barter');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <div className="bg-gray-900 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <button
              onClick={() => router.back()}
              className="flex items-center text-white hover:text-blue-400 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <h1 className="text-xl font-bold text-white">Add New Item</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-lg p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Transaction Type */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">Select Transaction Type</h2>
                  <div className="grid grid-cols-4 gap-2">
                    {transactionTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, transactionType: type.id }));
                          setStep(2);
                        }}
                        className="flex flex-col items-center justify-center p-2 rounded-full aspect-square transition-colors bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                      >
                        <span className="text-lg mb-0.5">{type.icon}</span>
                        <span className="text-[10px] font-medium text-center leading-tight">{type.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Category Selection */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Select Category</h2>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-gray-400 hover:text-white"
                    >
                      Back
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {formData.transactionType && categories[formData.transactionType as keyof typeof categories]?.map((category) => (
                      <motion.button
                        key={category.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: category.id }));
                          setStep(3);
                        }}
                        className="flex flex-col items-center justify-center p-2 rounded-full aspect-square transition-colors bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                      >
                        <span className="text-lg mb-0.5">{getCategoryIcon(category.id)}</span>
                        <span className="text-[10px] font-medium text-center leading-tight">{category.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Item Details */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Item Details</h2>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-gray-400 hover:text-white"
                    >
                      Back
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter item title"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your item"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Price (৳)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter price"
                      />
                    </div>

                    {formData.transactionType === 'offer' && (
                      <>
                        <div>
                          <label className="block text-gray-300 mb-2">Original Price (৳)</label>
                          <input
                            type="number"
                            value={formData.originalPrice}
                            onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter original price"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Discount (%)</label>
                          <input
                            type="number"
                            value={formData.discount}
                            onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter discount percentage"
                          />
                        </div>
                      </>
                    )}

                    {(formData.transactionType === 'swap' || formData.transactionType === 'sell') && (
                      <div>
                        <label className="block text-gray-300 mb-2">Swap Value (৳)</label>
                        <input
                          type="number"
                          value={formData.swapValue}
                          onChange={(e) => setFormData(prev => ({ ...prev, swapValue: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter swap value"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-gray-300 mb-2">Condition</label>
                      <select
                        value={formData.condition}
                        onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select condition</option>
                        {conditions.map((condition) => (
                          <option key={condition.id} value={condition.id}>
                            {condition.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter location"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Images</label>
                      <div className="mt-2">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      </div>
                      {previewImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {previewImages.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <FaTimes className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500 text-white rounded-lg">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="p-3 bg-green-500 text-white rounded-lg">
                        {success}
                      </div>
                    )}

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add Item
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddItemPage; 
