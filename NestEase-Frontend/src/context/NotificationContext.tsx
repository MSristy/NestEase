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
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/my`);
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

    // Connect to socket using JWT auth in the handshake
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const socket = ioClient(process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL}', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected to notifications server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected from notifications server');
    });

    socket.on('notification', (notification: Notification) => {
      console.log('Received notification via socket:', notification);
      // Refetch notifications to get the latest state from backend
      fetchNotifications();
      toast(notification.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markAllAsRead = async () => {
    await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`, { method: 'POST' });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markAsRead = async (id: number) => {
    await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/users/notifications/${id}/read`, { method: 'PUT' });
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
