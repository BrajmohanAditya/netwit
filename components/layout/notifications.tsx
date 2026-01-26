"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Lead",
    message: "John Doe submitted a lead form",
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
  },
  {
    id: "2",
    title: "Sale Completed",
    message: "Vehicle #VH123456 sold to Jane Smith",
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
  },
  {
    id: "3",
    title: "Inventory Update",
    message: "5 new vehicles added to inventory",
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: true,
  },
];

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleClear = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-md transition-colors duration-150"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 bg-primary text-white text-xs font-semibold rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[85vw] sm:w-96 bg-white rounded-lg shadow-elevation-4 border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-card-title font-semibold text-heading">
              Notifications
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted">No notifications</div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group",
                    !notification.read && "bg-primary-light",
                  )}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-heading">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-body mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted mt-2">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClear(notification.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 10 && (
            <div className="p-4 text-center border-t border-gray-200">
              <Button variant="link" className="text-sm">
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
