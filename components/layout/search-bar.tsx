"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn(
        "flex w-full sm:w-auto items-center gap-3 px-4 py-2 rounded-md border border-gray-200 bg-white transition-all duration-150",
        isFocused
          ? "border-primary shadow-elevation-2"
          : "hover:border-gray-300",
      )}
    >
      <Search className="h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search customers, vehicles, VINs..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 bg-transparent text-sm text-body outline-none placeholder-gray-500"
      />
      <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 bg-gray-50 text-xs text-gray-600">
        <span>⌘</span>K
      </kbd>
    </div>
  );
}
