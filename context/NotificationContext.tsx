"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { getNotificationsClient, markNotificationReadClient, markAllNotificationsReadClient, createNotificationClient } from '@/lib/services';
import { Notification } from '@/types';
import { useToast } from '@/context/ToastContext';

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (title: string, message: string) => Promise<void>;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  saveSearch: (url: string, name: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const supabase = createClient();
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 1. Initial Load
  useEffect(() => {
    if (user) {
      getNotificationsClient(user.id).then(setNotifications);
    } else {
      setNotifications([]);
    }
  }, [user]);

  // 2. Realtime Listener
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev]);
          addToast(newNotif.title, 'info');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const addNotification = async (title: string, message: string) => {
    if (!user) return;
    await createNotificationClient(user.id, title, message);
  };

  const markAsRead = async (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await markNotificationReadClient(id);
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    if (user) await markAllNotificationsReadClient(user.id);
  };

  const saveSearch = async (url: string, name: string) => {
    if (!user) { addToast('Please login to save search.', 'error'); return; }
    // Simulated save search action (real one should be in services)
    await addNotification('Search Saved', `"${name}" has been saved to your dashboard.`);
    addToast('Search saved successfully.', 'success');
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, saveSearch }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}