import React from 'react';
import Image from 'next/image';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';

// TypeScript interfaces
interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
  beds: number;
  baths: number;
  area: number;
  type: string;
  features: string[];
}

// Dummy data for properties
const properties: Property[] = [
  {
    id: 1,
    title: "Modern Apartment in Gulshan",
    price: "৳45,000",
    location: "Gulshan-2, Dhaka",
    image: "/1.jpg",
    beds: 3,
    baths: 2,
    area: 1200,
    type: "Apartment",
    features: ["Parking", "Security", "24/7 Water Supply"]
  },
  {
    id: 2,
    title: "Luxury Villa in Banani",
    price: "৳85,000",
    location: "Banani, Dhaka",
    image: "/2.jpg",
    beds: 4,
    baths: 3,
    area: 2500,
    type: "Villa",
    features: ["Garden", "Swimming Pool", "Gym"]
  },
  {
    id: 3,
    title: "Cozy Studio in Dhanmondi",
    price: "৳25,000",
    location: "Dhanmondi, Dhaka",
    image: "/3.jpg",
    beds: 1,
    baths: 1,
    area: 600,
    type: "Studio",
    features: ["Furnished", "Internet", "Power Backup"]
  },
  {
    id: 4,
    title: "Premium Apartment in Uttara",
    price: "৳65,000",
    location: "Uttara, Dhaka",
    image: "/4.jpg",
    beds: 3,
    baths: 2,
    area: 1800,
    type: "Apartment",
    features: ["Lift", "Generator", "CCTV"]
  }
];

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative h-48 w-full">
        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{property.title}</h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {property.type}
          </span>
        </div>
        <p className="text-2xl font-bold text-blue-600 mb-2">{property.price}/month</p>
        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="mr-1" />
          <span>{property.location}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-4">
          <div className="flex items-center">
            <FaBed className="mr-1" />
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center">
            <FaBath className="mr-1" />
            <span>{property.baths} Baths</span>
          </div>
          <div className="flex items-center">
            <FaRulerCombined className="mr-1" />
            <span>{property.area} sq ft</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {property.features.map((feature: string, index: number) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const PropertiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Properties</h1>
        
        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select className="border rounded p-2">
              <option>Property Type</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Studio</option>
            </select>
            <select className="border rounded p-2">
              <option>Price Range</option>
              <option>৳20,000 - ৳40,000</option>
              <option>৳40,000 - ৳60,000</option>
              <option>৳60,000+</option>
            </select>
            <select className="border rounded p-2">
              <option>Bedrooms</option>
              <option>1</option>
              <option>2</option>
              <option>3+</option>
            </select>
            <button className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700">
              Search Properties
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage; 
