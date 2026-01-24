"use client";

import { Notifications } from "./notifications";
import { AdminProfile } from "./admin-profile";
import { SearchBar } from "./search-bar";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full h-full px-4 sm:px-6 gap-3 sm:gap-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2 flex-1 w-full sm:max-w-md px-1 py-1">
        <button
          onClick={onMenuClick}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          aria-label="Open sidebar"
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>
        <SearchBar />
      </div>

      {/* Notifications + Admin Profile */}
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
        <Notifications />
        <AdminProfile />
      </div>
    </div>
  );
}
