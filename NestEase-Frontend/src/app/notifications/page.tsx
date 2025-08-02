'use client';

import { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTrash, FaFilter } from 'react-icons/fa';

type Notification = {
  id: number;
  type: 'property' | 'service' | 'swap' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'property' | 'service' | 'swap' | 'system'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:3001/users/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:3001/users/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:3001/users/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(notifications.filter(notification => notification.id !== notificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:3001/users/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaBell className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              </div>
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Mark all as read
              </button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <FaFilter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread</option>
                <option value="property">Property</option>
                <option value="service">Service</option>
                <option value="swap">Swap & Save</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No notifications found
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          title="Mark as read"
                        >
                          <FaCheck className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        title="Delete notification"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 