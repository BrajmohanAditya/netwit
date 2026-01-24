"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Car,
  TestTube,
  Handshake,
  Phone,
  ShoppingCart,
  PackageSearch,
  User,
  FileText,
  DollarSign,
  TrendingUp,
  Share2,
  Megaphone,
  UserCog,
  CheckSquare,
  TicketIcon,
  Settings,
  UserCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
  Badge,
  Receipt,
} from "lucide-react";

const navigationSections = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Calendar", href: "/calendar", icon: Calendar },
    ],
  },
  {
    title: "SALES",
    items: [
      { name: "Lead Center", href: "/leads", icon: Users, badge: "new" },
      { name: "Test Drives", href: "/test-drives", icon: TestTube },
      { name: "Deals", href: "/deals", icon: Handshake },
      { name: "Follow-ups", href: "/follow-ups", icon: Phone },
    ],
  },
  {
    title: "INVENTORY",
    items: [
      { name: "All Vehicles", href: "/inventory", icon: Car },
      {
        name: "Purchase from Public",
        href: "/inventory/public",
        icon: PackageSearch,
      },
    ],
  },
  {
    title: "CUSTOMERS",
    items: [
      { name: "Customer Directory", href: "/customers", icon: Users },
      { name: "Quotations", href: "/quotations", icon: FileText },
    ],
  },
  {
    title: "FINANCIAL",
    items: [
      { name: "Invoices", href: "/invoices", icon: Receipt },
      { name: "Expenses", href: "/expenses", icon: DollarSign },
      { name: "Reports", href: "/reports", icon: TrendingUp },
    ],
  },
  {
    title: "MARKETING",
    items: [
      { name: "Social Posting", href: "/social", icon: Share2 },
      { name: "Campaigns", href: "/campaigns", icon: Megaphone },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Users & Roles", href: "/users", icon: UserCog },
      { name: "Tasks", href: "/tasks", icon: CheckSquare },
      { name: "Tickets", href: "/tickets", icon: TicketIcon },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { name: "Profile", href: "/profile", icon: UserCircle },
      { name: "Business Profile", href: "/business-profile", icon: Building2 },
    ],
  },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export function Sidebar({ isMobileOpen, onMobileOpenChange }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const mobileOpen = isMobileOpen ?? internalMobileOpen;
  const setMobileOpen = onMobileOpenChange ?? setInternalMobileOpen;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex h-screen flex-col bg-white border-r border-gray-200 shadow-elevation-2 transition-all duration-300 z-40",
          "fixed left-0 top-0",
          "w-sidebar md:w-sidebar",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "md:w-sidebar-collapsed" : "md:w-sidebar",
        )}
      >
        {/* Logo/Branding */}
        <div className="flex h-header items-center justify-between border-b border-gray-200 px-4 bg-white relative overflow-hidden flex-shrink-0">
          <div className="flex items-center gap-2">
            <Logo />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-xs text-muted">DMS</span>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button - Desktop only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-20 z-50 hidden md:flex h-6 w-6 items-center justify-center rounded-full",
            "bg-primary text-white shadow-elevation-2",
            "hover:scale-110 transition-transform duration-150",
            "border border-primary/20",
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden absolute right-4 top-4 z-50 p-2 text-gray-500 hover:text-gray-700"
          aria-label="Close sidebar"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 px-3 py-6 overflow-y-auto">
          {navigationSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              {section.items.map((item) => {
                const isActive =
                  item.href === "/inventory"
                    ? pathname === "/inventory" ||
                      (pathname.startsWith("/inventory/") &&
                        !pathname.startsWith("/inventory/public"))
                    : pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <div key={item.name} className="group relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 relative",
                        isCollapsed ? "justify-center" : "justify-between",
                        isActive
                          ? "bg-primary-light text-primary border-l-4 border-primary"
                          : "bg-transparent text-body hover:bg-gray-100 text-gray-700",
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-colors duration-150",
                            isActive ? "text-primary" : "text-gray-500",
                          )}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item.name}</span>
                        )}
                      </div>
                      {!isCollapsed && item.badge && (
                        <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div
            className={cn(
              "flex items-center gap-3 rounded-md p-2 hover:bg-gray-100 transition-colors duration-150 cursor-pointer group relative",
              isCollapsed && "justify-center",
            )}
            title={isCollapsed ? "Profile" : undefined}
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
              AD
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-heading truncate">
                  Admin User
                </p>
                <p className="text-xs text-muted truncate">admin@adaptus.com</p>
              </div>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                Profile
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
