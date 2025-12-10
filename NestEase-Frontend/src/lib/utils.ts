import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Constructs a proper image URL for external images
 * @param imagePath - The image path from the backend
 * @param baseUrl - The base URL for the backend (default: process.env.NEXT_PUBLIC_API_URL)
 * @returns The complete image URL
 */
export function getImageUrl(imagePath: string, baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL}'): string {
  console.log('getImageUrl called with:', { imagePath, baseUrl });
  
  if (!imagePath) {
    console.log('No image path provided, returning placeholder');
    return '/images/placeholder.jpg';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('Image path is already a full URL:', imagePath);
    return imagePath;
  }
  
  // Remove any duplicate /uploads/properties/ if present
  const cleanPath = imagePath.replace(/\/uploads\/properties\/uploads\/properties\//, '/uploads/properties/');
  console.log('Cleaned path:', cleanPath);
  
  // Ensure the path starts with /
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  console.log('Normalized path:', normalizedPath);
  
  const finalUrl = `${baseUrl}${normalizedPath}`;
  console.log('Final URL:', finalUrl);
  
  return finalUrl;
}

/**
 * Handles image loading errors by providing a fallback
 * @param event - The error event
 * @param fallbackSrc - The fallback image source
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackSrc: string = '/images/placeholder.jpg') {
  const target = event.target as HTMLImageElement;
  target.src = fallbackSrc;
}

/**
 * Centralized fetch wrapper that always uses the latest token from localStorage
 * @param url - The API endpoint
 * @param options - Fetch options
 */
export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
} 
