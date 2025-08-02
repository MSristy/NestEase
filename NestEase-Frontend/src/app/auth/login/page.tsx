'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    defaultValues: {
      rememberMe: false
    }
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      console.log('Login successful:', result);
      // Store the token in localStorage or a secure cookie
      localStorage.setItem('token', result.access_token);
      // Redirect to dashboard or home page
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="h-full w-full relative flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-900 bg-opacity-40 flex flex-col items-center justify-center text-white p-12">
            <div className="max-w-md text-center">
              <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-lg mb-6">
                Log in to access your account and continue your journey with NestEase.
              </p>
              <div className="space-y-6">
                <div className="bg-white/10 rounded-lg p-6">
                  <div className="text-4xl mb-3">🏠</div>
                  <h3 className="text-xl font-semibold mb-2">Find Your Dream Home</h3>
                  <p>Access verified listings and connect with trusted landlords</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <div className="text-4xl mb-3">🛠️</div>
                  <h3 className="text-xl font-semibold mb-2">Book Home Services</h3>
                  <p>Get reliable professionals for all your home maintenance needs</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <div className="text-4xl mb-3">🔄</div>
                  <h3 className="text-xl font-semibold mb-2">Swap & Save</h3>
                  <p>Exchange items with others in your community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="lg:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center mb-6">
              <div className="relative h-10 w-10 mr-2">
                <Image 
                  src="/logo.svg" 
                  alt="NestEase Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">NestEase</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Log in to your account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back! Please enter your credentials.
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="your@email.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="********"
                  {...register('password', { 
                    required: 'Password is required',
                  })}
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
            
            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me for 30 days
              </label>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>
          
          {/* Social Login Options */}
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
          
          {/* Signup Link */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-blue-600 hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 