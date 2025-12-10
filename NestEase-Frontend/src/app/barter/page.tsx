'use client';


import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaExchangeAlt, FaThumbsUp, FaThumbsDown, FaComment, FaClock, FaChevronLeft, FaChevronRight, FaShoppingCart, FaMobile, FaCar, FaTshirt, FaChair, FaBicycle, FaBook, FaLaptop, FaTablet, FaMotorcycle, FaHome, FaUtensils, FaTools, FaGamepad, FaHeadphones, FaCamera, FaTv, FaCouch, FaBed, FaBasketballBall, FaGuitar, FaDumbbell, FaWrench, FaLeaf, FaBroom, FaFilter, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { barterItems } from '@/data/data'; 

// Add type definition for barter items
interface BarterItem {
  id: number;
  title: string;
  category: string;
  transactionType: string;
  price: number;
  condition: string;
  description: string;
  location: string;
  imageUrl: string;
  owner: {
    id: number;
    name: string;
    rating: number;
    swaps: number;
    phone?: string;
    email?: string;
  };
  swapValue?: number;
  additionalImages?: string[];
  discount?: number;
  originalPrice?: number;
  // Add new properties for sell products
  product_name?: string;
  product_condition?: string;
  images?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
}



const priceRanges = [
  { id: 'range1', name: 'Under 5,000', min: 0, max: 5000 },
  { id: 'range2', name: '5,000 - 20,000', min: 5000, max: 20000 },
  { id: 'range3', name: '20,000 - 50,000', min: 20000, max: 50000 },
  { id: 'range4', name: '50,000 - 1,00,000', min: 50000, max: 100000 },
  { id: 'range5', name: 'Above 1,00,000', min: 100000, max: Infinity },
];

const transactionTypes = [
  { id: 'sell', name: 'Sell' },
  { id: 'swap', name: 'Swap' },
  { id: 'offer', name: 'Offer' }
];

const categoryOptions = {
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
    { id: 'tools', name: 'Tools' },
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
    { id: 'fitness', name: 'Fitness' },
  ],
  swap: [
    { id: 'electronics', name: 'Electronics' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'vehicles', name: 'Vehicles' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'books', name: 'Books' },
    { id: 'sports', name: 'Sports' },
    { id: 'music', name: 'Music' },
    { id: 'tools', name: 'Tools' },
  ],
  offer: [
    { id: 'services', name: 'Services' },
    { id: 'rentals', name: 'Rentals' },
    { id: 'repairs', name: 'Repairs' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'gardening', name: 'Gardening' },
    { id: 'cooking', name: 'Cooking' },
    { id: 'transport', name: 'Transport' },
  ]
};

// Category icons mapping for barter categories
const CATEGORY_ICONS: { [key: string]: React.ElementType } = {
  // Sell categories
  smartphone: FaMobile,
  car: FaCar,
  dress: FaTshirt,
  furniture: FaChair,
  bike: FaBicycle,
  books: FaBook,
  laptop: FaLaptop,
  tablet: FaTablet,
  motorcycle: FaMotorcycle,
  house: FaHome,
  kitchen: FaUtensils,
  tools: FaTools,
  
  // Buy categories
  electronics: FaLaptop,
  gaming: FaGamepad,
  audio: FaHeadphones,
  camera: FaCamera,
  appliances: FaTv,
  bedroom: FaBed,
  sports: FaBasketballBall,
  music: FaGuitar,
  fitness: FaDumbbell,
  
  // Swap categories
  vehicles: FaCar,
  clothing: FaTshirt,
  
  // Offer categories
  services: FaWrench,
  rentals: FaHome,
  repairs: FaWrench,
  cleaning: FaBroom,
  gardening: FaLeaf,
  cooking: FaUtensils,
  transport: FaCar,
};

// Update the form state interface
interface FormData {
  title: string;
  category: string;
  transactionType: string;
  price: string;
  condition: string;
  description: string;
  location: string;
  image: File | null;
  imagePreview: string;
  discount: string;
  originalPrice: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
}

// Add this function before the BarterPage component
const getCategoryColor = (categoryId: string): string => {
  const colorMap: { [key: string]: string } = {
    // Electronics
    smartphone: 'blue',
    laptop: 'indigo',
    tablet: 'violet',
    camera: 'purple',
    tv: 'fuchsia',
    headphones: 'pink',
    
    // Vehicles
    car: 'red',
    bike: 'orange',
    motorcycle: 'amber',
    
    // Home & Furniture
    furniture: 'yellow',
    house: 'lime',
    kitchen: 'green',
    bedroom: 'emerald',
    couch: 'teal',
    bed: 'cyan',
    
    // Clothing & Fashion
    dress: 'sky',
    tshirt: 'blue',
    
    // Sports & Entertainment
    sports: 'indigo',
    gaming: 'violet',
    music: 'purple',
    guitar: 'fuchsia',
    basketball: 'pink',
    
    // Tools & Services
    tools: 'red',
    services: 'orange',
    repairs: 'amber',
    cleaning: 'yellow',
    gardening: 'lime',
    cooking: 'green',
    transport: 'emerald',
    
    // Books & Education
    books: 'teal',
    
    // Others
    electronics: 'cyan',
    audio: 'sky',
    appliances: 'blue',
    rentals: 'indigo',
    dumbbell: 'violet',
    wrench: 'purple',
    leaf: 'fuchsia',
    broom: 'pink',
  };

  return colorMap[categoryId] || 'gray';
};

const BarterPage = () => {
  const [selectedTransactionType, setSelectedTransactionType] = useState('sell');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showAddYoursModal, setShowAddYoursModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    transactionType: 'sell',
    price: '',
    condition: 'New',
    description: '',
    location: '',
    image: null,
    imagePreview: '',
    discount: '',
    originalPrice: '',
    ownerName: '',
    phoneNumber: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [items, setItems] = useState<BarterItem[]>([]);
  const [dbItems, setDbItems] = useState<BarterItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const router = useRouter();
  const [offers, setOffers] = useState<BarterItem[]>([]);
  const { theme } = useTheme();
  // Add these state variables at the top of the BarterPage component
  const [sellCartCount, setSellCartCount] = useState(0);
  const [offerCartCount, setOfferCartCount] = useState(0);
  const [showExchangeForm, setShowExchangeForm] = useState(false);
  // Add this state at the top of the BarterPage component
  const [userData, setUserData] = useState<any>(null);
  const [exchangeFormData, setExchangeFormData] = useState({
    title: '',
    category: '',
    condition: '',
    description: '',
    location: '',
    image: null as File | null,
    imagePreview: '',
    ownerName: '',
    phoneNumber: '',
    email: ''
  });
  const { user, loading } = useAuth();
  const { addToCart, isInCart, removeFromCart } = useCart();

  // Initialize cart count to 0 when component mounts
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const sellItems = storedItems.filter((item: any) => !item.type || item.type === 'sell');
    const offerItems = storedItems.filter((item: any) => item.type === 'offer');
    
    setSellCartCount(sellItems.length);
    setOfferCartCount(offerItems.length);
  }, []);

  // Listen for storage changes to update cart count
  useEffect(() => {
    const handleStorageChange = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const sellItems = cartItems.filter((item: any) => !item.type || item.type === 'sell');
      setSellCartCount(sellItems.length);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Enhanced search functionality
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      const results = barterItems.filter(item => {
        const searchLower = value.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(searchLower);
        const matchesDescription = item.description.toLowerCase().includes(searchLower);
        const matchesCategory = item.category.toLowerCase().includes(searchLower);
        const matchesLocation = item.location.toLowerCase().includes(searchLower);
        
        // If a category is selected, only show results from that category
        if (selectedCategory && item.category !== selectedCategory) {
          return false;
        }

        return matchesTitle || matchesDescription || matchesCategory || matchesLocation;
      });
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Add function to fetch items from database
  const fetchSwapItems = async (category?: string) => {
    try {
      setIsLoading(true);
      const url = category 
        ? `${process.env.NEXT_PUBLIC_API_URL}/add-swap?category=${category}`
        : '${process.env.NEXT_PUBLIC_API_URL}/add-swap';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch swap items');
      }
      
      const result = await response.json();
      if (result.success) {
        setDbItems(result.data);
      }
    } catch (error) {
      console.error('Error fetching swap items:', error);
      toast.error('Failed to fetch swap items');
    } finally {
      setIsLoading(false);
    }
  };

  // Add function to fetch sell products
  const fetchSellProducts = async (category?: string) => {
    try {
      setIsLoading(true);
      const url = category 
        ? `${process.env.NEXT_PUBLIC_API_URL}/add-sell?category=${category}`
        : '${process.env.NEXT_PUBLIC_API_URL}/add-sell';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch sell products');
      }
      
      const result = await response.json();
      if (result.success) {
        setDbItems(result.data);
      }
    } catch (error) {
      console.error('Error fetching sell products:', error);
      toast.error('Failed to fetch sell products');
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect to fetch items when category changes
  useEffect(() => {
    if (selectedTransactionType === 'swap') {
      fetchSwapItems(selectedCategory);
    } else if (selectedTransactionType === 'sell') {
      fetchSellProducts(selectedCategory);
    }
  }, [selectedTransactionType, selectedCategory]);

  // Update the filtered items logic
  const filteredItems = selectedTransactionType === 'swap' 
    ? dbItems.filter(item => {
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
        const matchesSearch = searchTerm 
          ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        return matchesCategory && matchesSearch;
      })
    : selectedTransactionType === 'sell'
    ? dbItems.filter(item => {
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
        const selectedRange = priceRanges.find(range => range.id === selectedPriceRange);
        const matchesPriceRange = selectedPriceRange && selectedRange
          ? selectedRange.min <= item.price && item.price <= selectedRange.max
          : true;
        const matchesSearch = searchTerm 
          ? (item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase()))
          : true;
        return matchesCategory && matchesPriceRange && matchesSearch;
      })
    : barterItems.filter(item => {
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
        const selectedRange = priceRanges.find(range => range.id === selectedPriceRange);
        const matchesPriceRange = selectedPriceRange && selectedRange
          ? selectedRange.min <= item.price && item.price <= selectedRange.max
          : true;
        const matchesSearch = searchTerm 
          ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        const matchesTransactionType = selectedTransactionType === 'swap' 
          ? item.transactionType === 'swap'
          : item.transactionType !== 'swap';
        return matchesCategory && matchesPriceRange && matchesSearch && matchesTransactionType;
      });

  // Auto-slide functionality
  useEffect(() => {
    // Only start the timer if the form is not open
    if (!showAddYoursModal) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % barterItems.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [showAddYoursModal]); // Add showAddYoursModal as a dependency

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % barterItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + barterItems.length) % barterItems.length);
  };

  // Add this function to handle offer details
  const handleViewOfferDetails = (item: any) => {
    setSelectedOffer(item);
    setShowOfferModal(true);
  };

  // Add this function to close the modal
  const handleCloseModal = () => {
    setShowOfferModal(false);
    setSelectedOffer(null);
  };

  // Add contact seller functionality
  const handleContactSeller = (item: any) => {
    setSelectedItem(item);
    setShowContactModal(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/contact-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: selectedItem.id,
          sellerId: selectedItem.owner.id,
          message: message.trim(),
          itemTitle: selectedItem.title,
          sellerName: selectedItem.owner.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setShowSuccessMessage(true);
      setMessage('');
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowContactModal(false);
      }, 2000);
    } catch (error) {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    } finally {
      setIsSending(false);
    }
  };

  // Add Contact Modal
  const ContactModal = () => (
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
              <div className="text-white font-medium">{selectedItem?.title}</div>
              <div className="text-gray-400 text-sm">Seller: {selectedItem?.owner.name}</div>
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
              Failed to send message. Please try again.
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
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Add form validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.image) errors.image = 'Image is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
    // Validate required fields
    if (!formData.title || !formData.category || !formData.transactionType || 
        !formData.price || !formData.condition || !formData.location || 
        !formData.description || !formData.image) {
      console.log('Validation failed:', {
        title: !formData.title,
        category: !formData.category,
        transactionType: !formData.transactionType,
        price: !formData.price,
        condition: !formData.condition,
        location: !formData.location,
        description: !formData.description,
        image: !formData.image
      });
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Adding your item...');
      console.log('Starting image upload');

      // Upload image first
      const imageFormData = new FormData();
      imageFormData.append('file', formData.image);
      
      const imageResponse = await fetch('/api/upload', {
        method: 'POST',
        body: imageFormData,
      });

      if (!imageResponse.ok) {
        console.error('Image upload failed:', await imageResponse.text());
        toast.dismiss(loadingToast);
        toast.error('Failed to upload image');
        return;
      }

      const { imageUrl } = await imageResponse.json();
      console.log('Image uploaded successfully:', imageUrl);

      // Prepare data for API
      const itemData = {
        title: formData.title,
        category: formData.category,
        transactionType: formData.transactionType,
        price: parseFloat(formData.price),
        condition: formData.condition,
        description: formData.description,
        location: formData.location,
        imageUrl: imageUrl,
        ownerId: 1,
        ownerName: 'Tareq Monour',
        swapValue: formData.transactionType === 'swap' ? parseFloat(formData.price) : null,
        discount: formData.discount ? parseInt(formData.discount) : null,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null
      };

      console.log('Submitting item data:', itemData);

      // Submit to API
      const response = await fetch('/api/barter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('API submission failed:', error);
        throw new Error(error.message || 'Failed to add item');
      }

      console.log('Item added successfully');

      // Dismiss loading toast and show success message
      toast.dismiss(loadingToast);
      toast.success('Item added successfully!');

      // Reset form and close modal
      setFormData({
        title: '',
        category: '',
        transactionType: 'sell',
        price: '',
        condition: '',
        description: '',
        location: '',
        image: null,
        imagePreview: '',
        discount: '',
        originalPrice: '',
        ownerName: '',
        phoneNumber: '',
        email: ''
      });
      setShowAddYoursModal(false);
      
      // Refresh the items list
      fetchItems();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add item');
    }
  };

  // Add this function to handle image upload
  const uploadImage = async (file: File): Promise<string> => {
    // Create form data for image upload
    const formData = new FormData();
    formData.append('file', file);

    // Upload to your image storage service
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
  };

  // Add this function to fetch items
  const fetchItems = async () => {
    try {
      const response = await fetch('/api/barter');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to fetch items');
    }
  };

  // Add the AddYoursForm component
  const AddYoursForm = () => {
    // Create a local state for the form
    const [localFormData, setLocalFormData] = useState<FormData>({
      ...formData,
      transactionType: selectedTransactionType === 'swap' ? 'swap' : formData.transactionType
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update local state when parent state changes
    useEffect(() => {
      setLocalFormData(prev => ({
        ...prev,
        transactionType: selectedTransactionType === 'swap' ? 'swap' : formData.transactionType
      }));
    }, [formData, selectedTransactionType]);

    // Initialize form data with user information when user data is available
    useEffect(() => {
      if (userData) {
        console.log('Initializing form with user data:', userData);
        setLocalFormData(prev => ({
          ...prev,
          ownerName: userData.name || '',
          phoneNumber: userData.phoneNumber || userData.phone || '',
          email: userData.email || ''
        }));
      }
    }, [userData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setLocalFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setLocalFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: previewUrl
        }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!localFormData.ownerName || !localFormData.title || !localFormData.category || 
          !localFormData.condition || !localFormData.location || !localFormData.description || !localFormData.image) {
        toast.error('Please fill in all required fields');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('owner_name', localFormData.ownerName.trim());
        formData.append('owner_phone', localFormData.phoneNumber.trim());
        formData.append('owner_email', localFormData.email.trim());
        formData.append('product_name', localFormData.title.trim());
        formData.append('category', localFormData.category.trim());
        formData.append('item_condition', localFormData.condition.trim());
        formData.append('location', localFormData.location.trim());
        formData.append('description', localFormData.description.trim());
        
        if (localFormData.image) {
          const file = localFormData.image;
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
            return;
          }
          if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
          }
          formData.append('image', file);
        }

        const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/add-swap', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add swap item');
        }

        const result = await response.json();
        toast.success('Swap item added successfully!');
        setShowAddYoursModal(false);
        setLocalFormData({
          title: '',
          category: '',
          transactionType: 'swap',
          price: '',
          condition: 'New',
          description: '',
          location: '',
          image: null,
          imagePreview: '',
          discount: '',
          originalPrice: '',
          ownerName: '',
          phoneNumber: '',
          email: ''
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to add swap item');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">Add Your Swap Item</h2>
              <button
                onClick={() => setShowAddYoursModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Owner Name */}
              <div>
                <label className="block text-gray-300 mb-2">Owner Name</label>
                <input
                  type="text"
                  name="ownerName"
                  value={localFormData.ownerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter owner name"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={localFormData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={localFormData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-gray-300 mb-2">Product Name</label>
                <input
                  type="text"
                  name="title"
                  value={localFormData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={localFormData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categoryOptions.swap.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-gray-300 mb-2">Condition</label>
                <select
                  name="condition"
                  value={localFormData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={localFormData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={localFormData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  placeholder="Enter item description"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-300 mb-2">Image</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700"
                  >
                    Choose Image
                  </label>
                  {localFormData.imagePreview && (
                    <div className="relative w-20 h-20">
                      <Image
                        src={localFormData.imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddYoursModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Add function to fetch item details
  const fetchItemDetails = async (id: number) => {
    try {
      setIsLoadingDetails(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-swap/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch item details');
      }
      const result = await response.json();
      if (result.success) {
        setSelectedItem(result.data);
        setShowOfferModal(true);
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      toast.error('Failed to fetch item details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Update the view details button click handler
  const handleViewDetails = async (item: any) => {
    if (selectedTransactionType === 'swap') {
      fetchItemDetails(item.id);
    } else if (selectedTransactionType === 'sell') {
      try {
        setIsLoadingDetails(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-sell/${item.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch sell product details');
        }
        const result = await response.json();
        if (result.success) {
          // Transform the data to match the expected format
          const transformedData = {
            ...result.data,
            title: result.data.product_name,
            condition: result.data.product_condition,
            imageUrl: result.data.images,
            owner: {
              name: result.data.owner_name,
              swaps: 0,
              rating: 0,
              phone: result.data.owner_phone,
              email: result.data.owner_email
            }
          };
          setSelectedItem(transformedData);
          setShowOfferModal(true);
        } else {
          throw new Error(result.message || 'Failed to fetch sell product details');
        }
      } catch (error) {
        console.error('Error fetching sell product details:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to fetch product details');
      } finally {
        setIsLoadingDetails(false);
      }
    } else if (selectedTransactionType === 'offer') {
      try {
        setIsLoadingDetails(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-offer/${item.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch offer details');
        }
        const result = await response.json();
        if (result.success) {
          // Transform the data to match the expected format
          const transformedData = {
            ...result.data,
            title: result.data.product_name,
            condition: result.data.product_condition,
            imageUrl: result.data.images,
            owner: {
              name: result.data.owner_name,
              swaps: 0,
              rating: 0,
              phone: result.data.owner_phone,
              email: result.data.owner_email
            }
          };
          setSelectedItem(transformedData);
          setShowOfferModal(true);
        } else {
          throw new Error(result.message || 'Failed to fetch offer details');
        }
      } catch (error) {
        console.error('Error fetching offer details:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to fetch offer details');
      } finally {
        setIsLoadingDetails(false);
      }
    }
  };

  // Update the OfferDetailsModal component
  const OfferDetailsModal = () => {
    const [localExchangeFormData, setLocalExchangeFormData] = useState({
      title: '',
      category: '',
      condition: '',
      description: '',
      location: '',
      image: null as File | null,
      imagePreview: '',
      ownerName: '',
      phoneNumber: '',
      email: ''
    });

    // Initialize form data when user data is available
    useEffect(() => {
      if (userData && showExchangeForm) {
        console.log('Initializing form with user data:', userData);
        setLocalExchangeFormData(prev => ({
          ...prev,
          ownerName: userData.name || '',
          phoneNumber: userData.phoneNumber || userData.phone || '',
          email: userData.email || ''
        }));
      }
    }, [userData, showExchangeForm]);

    const handleExchangeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      console.log('Input changed:', name, value);
      setLocalExchangeFormData(prev => {
        const newData = {
          ...prev,
          [name]: value
        };
        console.log('New form data:', newData);
        return newData;
      });
    };

    const handleExchangeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        console.log('Image selected:', file.name);
        const previewUrl = URL.createObjectURL(file);
        setLocalExchangeFormData(prev => {
          const newData = {
            ...prev,
            image: file,
            imagePreview: previewUrl
          };
          console.log('New form data with image:', newData);
          return newData;
        });
      }
    };

    const handleExchangeSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Form submission started with data:', localExchangeFormData);
      
      if (!isAuthenticated()) {
        toast.error('Please log in to submit an exchange offer');
        return;
      }

      // Validate required fields
      if (!localExchangeFormData.title || !localExchangeFormData.category || 
          !localExchangeFormData.condition || !localExchangeFormData.location || 
          !localExchangeFormData.description || !localExchangeFormData.image) {
        toast.error('Please fill in all required fields');
        return;
      }

      try {
        // Show loading toast
        const loadingToast = toast.loading('Submitting exchange offer...');

        // First upload the image
        const imageFormData = new FormData();
        imageFormData.append('file', localExchangeFormData.image);
        
        const imageResponse = await fetch('${process.env.NEXT_PUBLIC_API_URL}/upload', {
          method: 'POST',
          body: imageFormData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          toast.dismiss(loadingToast);
          throw new Error(errorData.message || 'Failed to upload image');
        }

        const { imageUrl } = await imageResponse.json();

        // Prepare data for the exchange_product table
        const exchangeData = {
          yourName: localExchangeFormData.ownerName.trim(),
          yourPhone: localExchangeFormData.phoneNumber.trim(),
          yourEmail: selectedItem?.owner?.email || '', // Use the owner's email from the selected item
          productName: localExchangeFormData.title.trim(),
          category: localExchangeFormData.category.trim(),
          itemCondition: localExchangeFormData.condition.trim(),
          location: localExchangeFormData.location.trim(),
          description: localExchangeFormData.description.trim(),
          images: imageUrl
        };

        console.log('Submitting exchange data:', exchangeData);

        // Submit to the exchange_product table
        const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/exchange/add-exchange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(exchangeData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.dismiss(loadingToast);
          throw new Error(errorData.message || 'Failed to add exchange offer');
        }

        const result = await response.json();
        if (result.success) {
          toast.dismiss(loadingToast);
          toast.success('Exchange offer added successfully!');
          setShowExchangeForm(false);
          // Reset form data
          const resetData = {
            title: '',
            category: '',
            condition: '',
            description: '',
            location: '',
            image: null,
            imagePreview: '',
            ownerName: '',
            phoneNumber: '',
            email: ''
          };
          setLocalExchangeFormData(resetData);
        } else {
          toast.dismiss(loadingToast);
          throw new Error(result.message || 'Failed to add exchange offer');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to add exchange offer');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">
                {selectedTransactionType === 'sell' ? selectedItem?.product_name : selectedItem?.title}
              </h2>
              <button
                onClick={() => {
                  setShowOfferModal(false);
                  setSelectedItem(null);
                  setShowExchangeForm(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {!showExchangeForm ? (
            <div className="space-y-6">
              {/* Image */}
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={selectedItem?.imageUrl}
                  alt={selectedItem?.title}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Owner Information */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Owner Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">{selectedItem?.owner?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white">{selectedItem?.owner?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white">{selectedItem?.owner?.email}</span>
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-4">
                {selectedTransactionType === 'offer' && selectedItem?.discount > 0 ? (
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-300">Original Price</div>
                      <div className="text-gray-400 line-through">৳{selectedItem?.price}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-300">Discounted Price</div>
                      <div className="text-green-500 font-semibold text-xl">
                        ৳{(selectedItem?.price - (selectedItem?.price * selectedItem?.discount / 100)).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-300">Discount</div>
                      <div className="text-red-500 font-semibold">-{selectedItem?.discount}%</div>
                    </div>
                  </div>
                ) : selectedTransactionType !== 'swap' && (
                  <div className="flex justify-between items-center">
                    <div className="text-gray-300">Price</div>
                    <div className="text-green-500 font-semibold text-xl">৳{selectedItem?.price}</div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-gray-300">Category</div>
                  <div className="text-white font-medium capitalize">{selectedItem?.category}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-gray-300">Condition</div>
                  <div className="text-white font-medium capitalize">{selectedItem?.condition}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-gray-300">Location</div>
                  <div className="text-white font-medium">{selectedItem?.location}</div>
                </div>

                <div>
                  <div className="text-gray-300 mb-2">Description</div>
                  <div className="text-white whitespace-pre-wrap">{selectedItem?.description}</div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowOfferModal(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                >
                  Close
                </button>
                {selectedTransactionType === 'swap' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!user) {
                        // Store the current path as the intended destination
                        localStorage.setItem('intendedDestination', '/barter');
                        // Redirect to login page
                        router.push('/auth/login');
                        return;
                      }
                      setShowExchangeForm(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Exchange your product
                  </motion.button>
                )}
                {(selectedTransactionType === 'sell' || selectedTransactionType === 'offer') && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1.5 text-primary-foreground text-sm rounded-md ${
                      isInCart(selectedItem.id)
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                    onClick={() => {
                      if (!user) {
                        // Store the current path as the intended destination
                        localStorage.setItem('intendedDestination', '/barter');
                        // Redirect to login page
                        router.push('/auth/login');
                        return;
                      }
                      handleAddToCart(selectedItem);
                    }}
                  >
                    {isInCart(selectedItem.id) ? 'Remove from Cart' : 'Add to Cart'}
                  </motion.button>
                )}
              </div>
            </div>
            ) : (
              <form onSubmit={handleExchangeSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={localExchangeFormData.ownerName}
                    onChange={handleExchangeInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={localExchangeFormData.phoneNumber}
                    onChange={handleExchangeInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={localExchangeFormData.email}
                    onChange={handleExchangeInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="title"
                    value={localExchangeFormData.title}
                    onChange={handleExchangeInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={localExchangeFormData.category}
                    onChange={handleExchangeInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.swap.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Condition</label>
                  <select
                    name="condition"
                    value={localExchangeFormData.condition}
                    onChange={handleExchangeInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={localExchangeFormData.location}
                    onChange={handleExchangeInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={localExchangeFormData.description}
                    onChange={handleExchangeInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleExchangeImageChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {localExchangeFormData.imagePreview && (
                    <div className="mt-2">
                      <img
                        src={localExchangeFormData.imagePreview}
                        alt="Preview"
                        className="max-w-xs rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowExchangeForm(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Submit Exchange Offer
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  const SellForm = () => {
    const [localFormData, setLocalFormData] = useState({
      title: '',
      category: '',
      price: '',
      condition: 'New',
      description: '',
      location: '',
      image: null as File | null,
      imagePreview: '',
      ownerName: '',
      phoneNumber: '',
      email: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setLocalFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setLocalFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file)
        }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!localFormData.ownerName || !localFormData.title || !localFormData.category || 
          !localFormData.condition || !localFormData.location || !localFormData.description || 
          !localFormData.image || !localFormData.price || !localFormData.phoneNumber || 
          !localFormData.email) {
        toast.error('Please fill in all required fields');
        return;
      }

      try {
        // First upload the image
        const imageFormData = new FormData();
        imageFormData.append('file', localFormData.image);
        
        const imageResponse = await fetch('${process.env.NEXT_PUBLIC_API_URL}/upload', {
          method: 'POST',
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          throw new Error(errorData.message || 'Failed to upload image');
        }

        const { imageUrl } = await imageResponse.json();

        // Prepare data for the sell_product table
        const productData = {
          owner_name: localFormData.ownerName.trim(),
          owner_phone: localFormData.phoneNumber.trim(),
          owner_email: localFormData.email.trim(),
          product_name: localFormData.title.trim(),
          price: parseFloat(localFormData.price),
          category: localFormData.category.trim(),
          product_condition: localFormData.condition.trim(),
          location: localFormData.location.trim(),
          description: localFormData.description.trim(),
          images: `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`
        };

        // Submit to the sell_product table
        const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/add-sell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add sell item');
        }

        const result = await response.json();
        if (result.success) {
          toast.success('Item added successfully!');
          setShowSellModal(false);
          setLocalFormData({
            title: '',
            category: '',
            price: '',
            condition: 'New',
            description: '',
            location: '',
            image: null,
            imagePreview: '',
            ownerName: '',
            phoneNumber: '',
            email: ''
          });
          
          // Refresh the items list
          if (selectedTransactionType === 'sell') {
            fetchSellProducts();
          }
        } else {
          throw new Error(result.message || 'Failed to add sell item');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to add sell item');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">Sell Your Product</h2>
              <button
                onClick={() => setShowSellModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Owner Name */}
              <div>
                <label className="block text-gray-300 mb-2">Owner Name</label>
                <input
                  type="text"
                  name="ownerName"
                  value={localFormData.ownerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter owner name"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={localFormData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={localFormData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-gray-300 mb-2">Product Name</label>
                <input
                  type="text"
                  name="title"
                  value={localFormData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-gray-300 mb-2">Price (in ৳)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">৳</span>
                  <input
                    type="number"
                    name="price"
                    value={localFormData.price}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={localFormData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categoryOptions.sell.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-gray-300 mb-2">Condition</label>
                <select
                  name="condition"
                  value={localFormData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={localFormData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={localFormData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  placeholder="Enter item description"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-300 mb-2">Image</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700"
                  >
                    Choose Image
                  </label>
                  {localFormData.imagePreview && (
                    <div className="relative w-20 h-20">
                      <Image
                        src={localFormData.imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSellModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Add the OfferForm component
  const OfferForm = () => {
    const [localFormData, setLocalFormData] = useState({
      title: '',
      category: '',
      price: '',
      discount: '',
      condition: 'New',
      description: '',
      location: '',
      image: null as File | null,
      imagePreview: '',
      ownerName: '',
      phoneNumber: '',
      email: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setLocalFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setLocalFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file)
        }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!localFormData.ownerName || !localFormData.title || !localFormData.category || 
          !localFormData.condition || !localFormData.location || !localFormData.description || 
          !localFormData.image || !localFormData.price || !localFormData.phoneNumber || 
          !localFormData.email) {
        toast.error('Please fill in all required fields');
        return;
      }

      try {
        // First upload the image
        const imageFormData = new FormData();
        imageFormData.append('file', localFormData.image);
        
        const imageResponse = await fetch('${process.env.NEXT_PUBLIC_API_URL}/upload', {
          method: 'POST',
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          throw new Error(errorData.message || 'Failed to upload image');
        }

        const { imageUrl } = await imageResponse.json();

        // Prepare data for the item_offer table
        const offerData = {
          owner_name: localFormData.ownerName.trim(),
          owner_phone: localFormData.phoneNumber.trim(),
          owner_email: localFormData.email.trim(),
          product_name: localFormData.title.trim(),
          price: parseFloat(localFormData.price),
          discount: localFormData.discount ? parseFloat(localFormData.discount) : 0,
          category: localFormData.category.trim(),
          product_condition: localFormData.condition.trim(),
          location: localFormData.location.trim(),
          description: localFormData.description.trim(),
          images: `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`
        };

        // Submit to the item_offer table
        const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/add-offer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(offerData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add offer');
        }

        const result = await response.json();
        if (result.success) {
          toast.success('Offer added successfully!');
          setShowOfferForm(false);
          setLocalFormData({
            title: '',
            category: '',
            price: '',
            discount: '',
            condition: 'New',
            description: '',
            location: '',
            image: null,
            imagePreview: '',
            ownerName: '',
            phoneNumber: '',
            email: ''
          });
          
          // Refresh the items list if needed
          if (selectedTransactionType === 'offer') {
            fetchOffers();
          }
        } else {
          throw new Error(result.message || 'Failed to add offer');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to add offer');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">Add Your Offer</h2>
              <button
                onClick={() => setShowOfferForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Owner Name */}
              <div>
                <label className="block text-gray-300 mb-2">Owner Name</label>
                <input
                  type="text"
                  name="ownerName"
                  value={localFormData.ownerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter owner name"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={localFormData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={localFormData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-gray-300 mb-2">Product Name</label>
                <input
                  type="text"
                  name="title"
                  value={localFormData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-gray-300 mb-2">Price (in ৳)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">৳</span>
                  <input
                    type="number"
                    name="price"
                    value={localFormData.price}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-gray-300 mb-2">Discount (%)</label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                  <input
                    type="number"
                    name="discount"
                    value={localFormData.discount}
                    onChange={handleInputChange}
                    className="w-full pr-8 pl-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter discount percentage"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={localFormData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categoryOptions.offer.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-gray-300 mb-2">Condition</label>
                <select
                  name="condition"
                  value={localFormData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={localFormData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={localFormData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  placeholder="Enter item description"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-300 mb-2">Image</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="offer-image-upload"
                  />
                  <label
                    htmlFor="offer-image-upload"
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700"
                  >
                    Choose Image
                  </label>
                  {localFormData.imagePreview && (
                    <div className="relative w-20 h-20">
                      <Image
                        src={localFormData.imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowOfferForm(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Add function to fetch offers
  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/add-offer');
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      
      const result = await response.json();
      if (result.success) {
        setOffers(result.data);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Failed to fetch offers');
    } finally {
      setIsLoading(false);
    }
  };

  // Add useEffect to fetch offers when component mounts
  useEffect(() => {
    fetchOffers();
  }, []);

  // Add this useEffect to fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No authentication token found');
          return;
        }

        const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/users/current-user', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('User data fetched successfully:', result.data);
            setUserData(result.data);
            // Update exchange form data with user information
            setExchangeFormData(prev => ({
              ...prev,
              ownerName: result.data.name || '',
              phoneNumber: result.data.phone || '',
              email: result.data.email || ''
            }));
          } else {
            console.warn('Failed to fetch user data:', result.message);
          }
        } else if (response.status === 401) {
          console.warn('User is not authenticated');
          // Clear any invalid token
          localStorage.removeItem('token');
        } else {
          console.warn('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Add a function to check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const handleAddToCart = (item: any) => {
    if (isInCart(item.id)) {
      removeFromCart(item.id);
      toast.success('Item removed from cart');
    } else {
      const cartItem = {
        ...item,
        type: 'sell',
        price: parseFloat(item.price) || 0,
        discount: parseFloat(item.discount) || 0
      };
      addToCart(cartItem);
      toast.success('Item added to cart');
    }
  };

  const handleExchangeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      // Update the parent state
      setExchangeFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: previewUrl
      }));
    }
  };

  // Add this function to handle the Add Your Swap button click
  const handleAddSwapClick = () => {
    if (!user) {
      // Store the current path as the intended destination
      localStorage.setItem('intendedDestination', '/barter');
      // Redirect to login page
      router.push('/auth/login');
      return;
    }
    setShowAddYoursModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sub-navbar: Sell | Swap | Offer and search */}
      <div className="w-full bg-card shadow z-40">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-2">
            {transactionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedTransactionType(type.id)}
                className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${selectedTransactionType === type.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
              >
                {type.name}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Main Heading Section - matching property page style */}
        <div className="text-center mb-12 py-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {selectedTransactionType === 'sell' && 'Sell & Earn'}
            {selectedTransactionType === 'swap' && 'Swap & Save'}
            {selectedTransactionType === 'offer' && 'Offer Your Services'}
            {!selectedTransactionType && 'Barter, Swap & Connect'}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            {selectedTransactionType === 'sell' && 'Turn your unused items into cash—list them for sale and connect with local buyers.'}
            {selectedTransactionType === 'swap' && 'Trade what you have for what you need—discover great deals through swapping!'}
            {selectedTransactionType === 'offer' && 'Share your skills or rentals—help your community and grow your business.'}
            {!selectedTransactionType && 'Exchange goods and services with your community. List, swap, or offer—find what you need!'}
          </p>
        </div>

        {/* Category Options */}
        <AnimatePresence>
          {selectedTransactionType && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 bg-card rounded-lg shadow-sm p-4"
            >
              <h2 className="text-base font-semibold text-card-foreground mb-3">
                Select a Category
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {selectedTransactionType && categoryOptions[selectedTransactionType as keyof typeof categoryOptions]?.map((category) => {
                  const Icon = CATEGORY_ICONS[category.id] || FaTimes;
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedCategory === category.id 
                          ? 'bg-blue-600 text-white shadow-lg scale-105' 
                          : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-3 rounded-lg mb-2 ${
                        selectedCategory === category.id 
                          ? 'bg-white text-blue-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-end mb-8">
          {selectedTransactionType === 'sell' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!user) {
                  // Store the current path as the intended destination
                  localStorage.setItem('intendedDestination', '/barter');
                  // Redirect to login page
                  router.push('/auth/login');
                  return;
                }
                setShowSellModal(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Sell Your Product
            </motion.button>
          )}
          {selectedTransactionType === 'swap' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddSwapClick}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add Your Swap
            </motion.button>
          )}
          {selectedTransactionType === 'offer' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!user) {
                  // Store the current path as the intended destination
                  localStorage.setItem('intendedDestination', '/barter');
                  // Redirect to login page
                  router.push('/auth/login');
                  return;
                }
                setShowOfferForm(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add Your Offer
            </motion.button>
          )}
        </div>

        {/* Price Range Filter */}
        {selectedCategory && selectedTransactionType !== 'swap' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-card rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-card-foreground">
                Price Range
              </h2>
              <button
                onClick={() => setSelectedPriceRange('')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear Filter
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <motion.button
                  key={range.id}
                  onClick={() => setSelectedPriceRange(range.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedPriceRange === range.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-accent text-foreground'
                  }`}
                >
                  {range.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Product Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {selectedCategory 
                ? `${categoryOptions[selectedTransactionType as keyof typeof categoryOptions]
                    .find(cat => cat.id === selectedCategory)?.name || selectedCategory} Items`
                : selectedTransactionType === 'swap' 
                  ? 'Swap Items'
                  : 'All Items'}
            </h2>
            <div className="text-sm text-muted-foreground">
              {selectedTransactionType === 'offer' ? offers.length : filteredItems.length} items found
            </div>
          </div>

          {/* Offer Cards Section */}
          {selectedTransactionType === 'offer' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading offers...</p>
                </div>
              ) : offers.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No offers available at the moment.</p>
                </div>
              ) : (
                offers.map((offer, index) => {
                  const discountedPrice = offer.discount ? offer.price - (offer.price * offer.discount / 100) : offer.price;
                  const itemInCart = isInCart(offer.id);
                  
                  return (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-border"
                    >
                      <div className="relative h-48">
                        <Image
                          src={offer.images || '/placeholder.jpg'}
                          alt={offer.product_name || 'Offer Image'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                        {offer.discount && offer.discount > 0 && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            -{offer.discount}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-1">
                          {offer.product_name}
                        </h3>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <span className="mr-2">Location: {offer.location || 'Not specified'}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {offer.description || 'Special offer available for this item.'}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            {offer.discount && offer.discount > 0 ? (
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground line-through">৳{offer.price}</span>
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">৳{discountedPrice.toFixed(2)}</span>
                              </div>
                            ) : (
                              <span className="text-xl font-bold text-green-600 dark:text-green-400">৳{offer.price}</span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <div className="bg-accent h-8 w-8 rounded-full flex items-center justify-center mr-2">
                              <span className="text-sm">👤</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-card-foreground">{offer.owner_name || 'Anonymous'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors"
                            onClick={() => handleViewDetails(offer)}
                          >
                            View Details
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex-1 px-4 py-2 text-primary-foreground text-sm rounded-md transition-colors ${
                              itemInCart
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            onClick={() => {
                              if (!user) {
                                localStorage.setItem('intendedDestination', '/barter');
                                router.push('/auth/login');
                                return;
                              }
                              const cartItem = {
                                id: offer.id,
                                product_name: offer.product_name,
                                price: typeof offer.price === 'number' ? offer.price : parseFloat(String(offer.price)),
                                discount: typeof offer.discount === 'number' ? offer.discount : (parseFloat(String(offer.discount)) || 0),
                                type: 'offer',
                                images: offer.images
                              };
                              handleAddToCart(cartItem);
                            }}
                          >
                            {itemInCart ? 'Remove' : 'Add to Cart'}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          ) : (
            /* Regular Items Grid for Sell and Swap */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading items...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="col-span-full text-center py-8">
                </div>
              ) : (
                filteredItems.map((item: any, index) => {
                  const itemInCart = isInCart(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      <div className="h-48 relative">
                        <Image
                          src={selectedTransactionType === 'sell' 
                            ? (item.images || '/placeholder.jpg') 
                            : (item.imageUrl || '/placeholder.jpg')}
                          alt={selectedTransactionType === 'sell' 
                            ? (item.product_name || 'Product Image') 
                            : (item.title || 'Item Image')}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-card-foreground">
                            {selectedTransactionType === 'sell' ? item.product_name : item.title}
                          </h3>
                          {selectedTransactionType === 'sell' && (
                            <span className="text-lg font-semibold text-green-600 dark:text-green-400">৳{item.price}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <span className="mr-2">Condition: {item.product_condition || item.condition}</span>
                          <span>Location: {item.location}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {item.description}
                        </p>
                      
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-accent h-8 w-8 rounded-full flex items-center justify-center mr-2">
                              <span className="text-sm">👤</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-card-foreground">{item.owner_name || item.owner?.name}</p>
                              {item.owner?.swaps && (
                                <p className="text-xs text-muted-foreground">
                                  {item.owner.swaps} swaps
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90"
                              onClick={() => handleViewDetails(item)}
                            >
                              View Details
                            </motion.button>
                            {selectedTransactionType === 'sell' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-3 py-1.5 text-primary-foreground text-sm rounded-md ${
                                  itemInCart
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-primary hover:bg-primary/90'
                                }`}
                                onClick={() => {
                                  if (!user) {
                                    // Store the current path as the intended destination
                                    localStorage.setItem('intendedDestination', '/barter');
                                    // Redirect to login page
                                    router.push('/auth/login');
                                    return;
                                  }
                                  handleAddToCart(item);
                                }}
                              >
                                {itemInCart ? 'Remove from Cart' : 'Add to Cart'}
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Offer Details Modal */}
      {showOfferModal && <OfferDetailsModal />}

      {/* Add Contact Modal */}
      {showContactModal && <ContactModal />}

      {/* Add the AddYoursForm modal */}
      {showAddYoursModal && <AddYoursForm />}

      {/* Add the SellForm modal */}
      {showSellModal && <SellForm />}

      {/* Add the OfferForm modal */}
      {showOfferForm && <OfferForm />}
    </div>
  );
};

export default BarterPage;
