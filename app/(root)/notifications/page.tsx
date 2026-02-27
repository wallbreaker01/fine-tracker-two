'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { is } from "zod/locales";

type Notification = {
  id: number;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Message",
      description: "You have received a new message from John.",
      isRead: true,
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 2,
      title: "New Message",
      description: "You have received a new message from John.",
      isRead: true,
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 3,
      title: "New Message",
      description: "You have received a new message from John.",
      isRead: false,
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 4,
      title: "New Message",
      description: "You have received a new message from John.",
      isRead: false,
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 5,
      title: "New Message",
      description: "You have received a new message from John.",
      isRead: false,
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 6,
      title: "New Message",
      description: "You have received a new message from John.",
      isRead: false,
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 7,
      title: "New Message",
      description: "You have received a new message from John.",
      isRead: true,
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 8,
      title: "New Message",
      description: "You have received a new message from John.",
      isRead: false,
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 9,
      title: "New Message",
      description: "You have received a new message from John.",
      isRead: true,
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 10,
      title: "New Message",
      description: "You have received a new message from John.",
      isRead: true,
      createdAt: '2024-06-01T10:00:00Z'
    },

  ]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification)
    )
  }
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true, }))
    )
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-2">Notifications</h1>
        <button onClick={markAllAsRead} className="text-sm font-medium text-blue-400 hover:text-blue-300 border border-blue-400/30 px-3 py-1.5 rounded-md transition">Mark all as read</button>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-1 rounded-lg transition ${notification.isRead ? 'bg-gray-700' : 'bg-green-500'}`}>
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{notification.title}</h2>
              {!notification.isRead && (
                <span className="text-xs bg-black px-2 py-1 rounded">New</span>
              )}
            </div>
            <div className="flex justify-between items-start mt-2">
              <p className="text-sm text-white opacity-80 ">{notification.description}</p>
              {!notification.isRead && (
                <Button onClick={() => markAsRead(notification.id)}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 border border-blue-400/30 px-0.5 py-0.5 rounded-md transition">
                  Mark as read</Button>)}
            </div>
            <p className="text-xs opacity-50 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}