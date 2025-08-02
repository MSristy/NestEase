'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import ioClient from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/utils';

interface Notification {
  id?: number;
  type: string;
  message: string;
  data?: any;
  read?: boolean;
  createdAt?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    // Fetch initial notifications
    const fetchNotifications = async () => {
      const response = await apiFetch(`http://localhost:3001/notifications/my`);
      const data = await response.json();
      const notificationsArray = Array.isArray(data)
        ? data
        : Array.isArray(data.notifications)
          ? data.notifications
          : Array.isArray(data.data)
            ? data.data
            : [];
      setNotifications(notificationsArray);
      setUnreadCount(notificationsArray.filter((n: Notification) => !n.read).length);
    };
    fetchNotifications();

    // Connect to socket
    const socket = ioClient('http://localhost:3001', {
      query: { userId: user.id },
      transports: ['websocket'],
    });

    socket.on('notification', (notification: Notification) => {
      // Refetch notifications to get the latest state from backend
      fetchNotifications();
      toast(notification.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markAllAsRead = async () => {
    await apiFetch(`http://localhost:3001/notifications/read-all`, { method: 'POST' });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markAsRead = async (id: number) => {
    await apiFetch(`http://localhost:3001/users/notifications/${id}/read`, { method: 'PUT' });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}; 