"use client";

import { Breadcrumbs } from "./breadcrumbs";
import { SearchBar } from "./search-bar";
import { Notifications } from "./notifications";
import { UserMenu } from "./user-menu";

export function Navbar() {
  return (
    <div className="flex items-center justify-between w-full h-full px-6 gap-4">
      {/* Left: Breadcrumbs */}
      <div className="min-w-0">
        <Breadcrumbs />
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center">
        <SearchBar />
      </div>

      {/* Right: Notifications + User Menu */}
      <div className="flex items-center gap-4">
        <Notifications />
        <UserMenu />
      </div>
    </div>
  );
}
