"use client";

import { Notifications } from "./notifications";
import { AdminProfile } from "./admin-profile";
import { SearchBar } from "./search-bar";

export function Navbar() {
  return (
    <div className="flex items-center justify-between w-full h-full px-4 sm:px-6 gap-2 sm:gap-4">
      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center max-w-md">
        <SearchBar />
      </div>

      {/* Right: Notifications + Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Notifications />
        <AdminProfile />
      </div>
    </div>
  );
}
