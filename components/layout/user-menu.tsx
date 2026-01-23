"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  user?: {
    email?: string;
    user_metadata?: {
      name?: string;
    };
    role?: string;
  } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast.success("Signed out successfully!");
    } catch (error) {
      toast.error("Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  const userEmail = user?.email || "user@adaptus.com";
  const userName = user?.user_metadata?.name || "User";
  const userRole = user?.role || "user";
  const initials = userEmail
    .split("@")[0]
    .split("")
    .slice(0, 2)
    .map((c) => c.toUpperCase())
    .join("");

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center gap-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
        <span className="text-sm font-medium text-heading hidden sm:inline">
          {userEmail.split("@")[0]}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-elevation-4 border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-heading">{userName}</p>
            <p className="text-xs text-muted">{userEmail}</p>
            <span className="inline-block mt-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded">
              {userRole}
            </span>
          </div>

          <div className="py-2">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-body hover:bg-gray-100 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>

          <div className="border-t border-gray-200 p-2">
            <Button
              variant="outline"
              className="flex items-center gap-3 w-full"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              disabled={isLoading}
            >
              <LogOut className="h-4 w-4" />
              {isLoading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
