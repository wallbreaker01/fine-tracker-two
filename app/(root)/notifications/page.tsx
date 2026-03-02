'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Notification } from "@/lib/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/notification');
        if (!response.ok) throw new Error('Failed to fetch notifications');

        const data = await response.json();
        if (data.success) {
          setNotifications(data.data || []);
        } else {
          setError('Failed to load notifications');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch('/api/notification', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAsRead', notificationId: id }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notification', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllAsRead' }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, isRead: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationColor = (isRead: boolean) => {
    return isRead ? 'bg-gray-700' : 'bg-green-500';
  };

  return (
    <div className="min-h-screen text-white p-6 ml-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-2">Notifications</h1>
        {notifications.length > 0 && (
          <button onClick={markAllAsRead} className="text-sm font-medium text-blue-400 hover:text-blue-300 border border-blue-400/30 px-3 py-1.5 rounded-md transition">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className={`p-4 rounded-lg transition ${getNotificationColor(notification.isRead)}`}>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-semibold">{notification.title}</h2>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/30 border border-blue-500/50">{notification.type}</span>
                    {!notification.isRead && (
                      <span className="text-xs bg-black px-2 py-1 rounded">New</span>
                    )}
                  </div>
                  <p className="text-sm text-white opacity-80 mb-2">{notification.description}</p>
                  <p className="text-xs opacity-50">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
                {!notification.isRead && (
                  <Button onClick={() => markAsRead(notification.id)} className="text-xs font-medium text-blue-500 hover:text-blue-300 border border-blue-400/30 px-2 py-1 rounded-md transition ml-4">
                    Mark as read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}