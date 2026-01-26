"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col relative">
      {/* Fixed Sidebar + Header Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar - Always Visible */}
        <Sidebar
          isMobileOpen={isMobileOpen}
          onMobileOpenChange={setIsMobileOpen}
          isCollapsed={isCollapsed}
          onCollapseChange={setIsCollapsed}
        />

        {/* Main Content Area - Adjusts for sidebar */}
        <div
          className={cn(
            "layout-content flex flex-col flex-1 w-full min-w-0 transition-all duration-300",
            // Mobile: No margin
            "ml-0",
            // Desktop: Dynamic margin based on collapsed state
            isCollapsed ? "md:ml-[72px]" : "md:ml-[256px]",
          )}
        >
          {/* Fixed Header - Stays at top */}
          <header
            className={cn(
              "layout-header bg-white border-b border-gray-200 shadow-elevation-1 fixed right-0 top-0 h-header z-30 transition-all duration-300",
              // Mobile: Full width
              "left-0 w-full",
              // Desktop: Adjusts with sidebar
              isCollapsed
                ? "md:left-[72px] md:w-[calc(100%-72px)]"
                : "md:left-[256px] md:w-[calc(100%-256px)]",
            )}
          >
            <Navbar onMenuClick={() => setIsMobileOpen(true)} />
          </header>

          {/* Scrollable Main Content */}
          <main className="layout-main bg-white overflow-y-auto flex-1 mt-header p-4 sm:p-6 md:p-8">
            <div className="transition-smooth animate-in fade-in slide-in-from-bottom duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
