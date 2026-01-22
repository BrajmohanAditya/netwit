"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Handle logout logic
    console.log("Logging out...");
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center gap-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
          AD
        </div>
        <span className="text-sm font-medium text-heading hidden sm:inline">
          Admin
        </span>
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-elevation-4 border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-heading">Admin User</p>
            <p className="text-xs text-muted">admin@adaptus.com</p>
          </div>

          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-body hover:bg-gray-100 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-body hover:bg-gray-100 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>

          <div className="border-t border-gray-200 p-2">
            <Button
              variant="destructive"
              className="flex items-center gap-3 w-full"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
