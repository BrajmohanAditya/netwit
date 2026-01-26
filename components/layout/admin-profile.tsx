"use client";

import { useState } from "react";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export function AdminProfile() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    toast.success("Signed out successfully!");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-150"
      >
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
          AD
        </div>
        <span className="text-sm font-medium text-heading">Admin</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-600 transition-transform duration-150",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-elevation-3 border border-gray-200 z-40">
            <div className="p-3 border-b border-gray-200">
              <p className="text-sm font-medium text-heading">Admin User</p>
              <p className="text-xs text-muted">admin@adaptus.com</p>
            </div>

            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-body hover:bg-gray-50 transition-colors duration-150">
              <User className="h-4 w-4 text-gray-600" />
              Profile
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-body hover:bg-gray-50 transition-colors duration-150">
              <Settings className="h-4 w-4 text-gray-600" />
              Settings
            </button>

            <div className="border-t border-gray-200"></div>

            <button
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive-light transition-colors duration-150"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
