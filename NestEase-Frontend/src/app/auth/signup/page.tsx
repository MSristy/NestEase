'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Role } from '@/types/role.enum';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  userType: z.enum(['tenant', 'landlord', 'buyer', 'seller', 'service_provider', 'general']),
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof formSchema>;

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: 'general'
    }
  });
  
  const password = watch('password');
  
  // Map userType to role
  const getUserRole = (userType: string): Role => {
    switch (userType) {
      case 'service_provider':
        return Role.SERVICE_PROVIDER;
      case 'landlord':
        return Role.LANDLORD;
      case 'tenant':
        return Role.TENANT;
      case 'buyer':
        return Role.BUYER;
      case 'seller':
        return Role.SELLER;
      case 'general':
      default:
        return Role.USER;
    }
  };
  
  const onSubmit = async (data: SignupFormValues) => {
    const mappedRole = getUserRole(data.userType);
    console.log('Submitting signup with role:', mappedRole);
    
    try {
      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: `${data.firstName} ${data.lastName}`,
          role: mappedRole
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const result = await response.json();
      console.log('Signup successful:', result);
      
      // Store user data in localStorage
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Redirect to appropriate page based on role
      if (mappedRole === Role.SERVICE_PROVIDER) {
        window.location.href = '/service-provider-profile';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="lg:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Create your account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Join NestEase to find properties, book services, and swap items
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="John"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Doe"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="your@email.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="********"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="********"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                I am registering as a:
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register('userType')}
              >
                <option value="general">General User</option>
                <option value="tenant">Tenant (Looking for property)</option>
                <option value="landlord">Landlord (Renting out property)</option>
                <option value="buyer">Buyer (Looking to buy property)</option>
                <option value="seller">Seller (Selling property)</option>
                <option value="service_provider">Service Provider</option>
              </select>
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                id="terms"
                {...register('agreeTerms')}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create Account
            </button>
          </form>
          
          {/* Social Signup Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FaGoogle className="mr-2 h-5 w-5 text-red-500" />
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FaFacebook className="mr-2 h-5 w-5 text-blue-500" />
                Facebook
              </button>
            </div>
          </div>
          
          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="h-full w-full relative flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-900 bg-opacity-40 flex flex-col items-center justify-center text-white p-12">
            <div className="max-w-md text-center">
              <h2 className="text-3xl font-bold mb-4">Join the NestEase Community</h2>
              <p className="text-lg mb-6">
                Find verified properties, connect with trusted service providers, and swap items with ease.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                    <span className="text-xl">🏠</span>
                  </div>
                  <p className="text-sm md:text-base">Access to verified property listings</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                    <span className="text-xl">🛠️</span>
                  </div>
                  <p className="text-sm md:text-base">Book reliable home services</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                    <span className="text-xl">🔄</span>
                  </div>
                  <p className="text-sm md:text-base">Exchange items with others in your community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 