'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiSun, FiMoon, FiUser, FiSettings, FiLogOut, FiBell, FiShoppingCart } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Transition } from '@headlessui/react';
import { Role } from '@/types/role.enum';

const mockNotifications = [
  {
    id: 1,
    title: 'New Property Available',
    description: 'A new property matching your preferences is now available.',
    time: '2 hours ago',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Service Request Accepted',
    description: 'Your service request has been accepted by a provider.',
    time: '5 hours ago',
    color: 'bg-green-500',
  },
  {
    id: 3,
    title: 'Save & Swap Update',
    description: 'New items available for swap in your area.',
    time: '1 day ago',
    color: 'bg-yellow-500',
  },
];
const unreadCount = mockNotifications.length;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { cartCount } = useCart();
  
  // Navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Property Rental', href: '/property' },
    { name: 'Home Services', href: '/services' },
    { name: 'Swap & Save', href: '/barter' },
  ];

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed top-0 left-0 w-full z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-8 w-8 mr-2">
              <Image 
                src="/logo.svg" 
                alt="NestEase Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">NestEase</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-md text-lg font-medium transition-colors
                  ${pathname === link.href 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            {/* Add Complete Profile link for service providers only */}
            {user && user.role === Role.SERVICE_PROVIDER && (
              <Link href="/service-provider-profile">
                <Button variant="outline">Add Service</Button>
              </Link>
            )}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* Cart Icon - Only show when user is logged in */}
            {user && (
              <Link href="/cart" className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Notification Bell */}
            <Menu as="div" className="relative">
              <Menu.Button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 relative" aria-label="Notifications">
                <FiBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Menu.Button>
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800 font-semibold text-gray-700 dark:text-gray-200">Notifications</div>
                  <div className="max-h-72 overflow-y-auto">
                    {mockNotifications.length === 0 ? (
                      <div className="p-4 text-gray-500 text-sm">No notifications</div>
                    ) : (
                      mockNotifications.map((notif) => (
                        <div key={notif.id} className="flex flex-col gap-1 px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${notif.color}`}></span>
                            <span className="font-medium text-gray-800 dark:text-gray-100">{notif.title}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{notif.time}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{notif.description}</span>
                        </div>
                      ))
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            {/* Theme Toggle */}
            {mounted && (
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            )}

            {/* Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs leading-none text-blue-600 font-medium capitalize">
                        {user.role?.toLowerCase().replace('_', ' ')}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <FiUser className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <FiSettings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={logout}
                  >
                    <FiLogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link 
                  href="/auth/login" 
                  className="px-4 py-2 text-lg font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  Log In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="px-4 py-2 text-lg font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1 px-2 pb-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-lg font-medium
                    ${pathname === link.href 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <div className="pt-4 mt-3 border-t border-gray-200 dark:border-gray-700">
                    <Link 
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/settings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 mt-3 border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    href="/auth/login" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 