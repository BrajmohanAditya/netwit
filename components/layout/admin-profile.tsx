"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/components/auth-provider";

export function AdminProfile() {
  const router = useRouter();
  const convex = useConvex();
  const { user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleSignOut = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        await convex.mutation(api.auth.deleteSession, { sessionId });
        localStorage.removeItem("sessionId");
      }
      await logout();
      toast.success("Signed out successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-150"
      >
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
          {getInitials(user.name)}
        </div>
        <span className="text-sm font-medium text-heading">
          {user.name}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-600 transition-transform duration-150",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-elevation-3 border border-gray-200 z-40">
            <div className="p-3 border-b border-gray-200">
              <p className="text-sm font-medium text-heading">
                {user.name}
              </p>
              <p className="text-xs text-muted truncate">{user.email}</p>
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
