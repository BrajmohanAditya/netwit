"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col relative">
      {/* Fixed Sidebar + Header Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar - Always Visible */}
        <Sidebar
          isMobileOpen={isMobileOpen}
          onMobileOpenChange={setIsMobileOpen}
        />

        {/* Main Content Area - Adjusts for sidebar */}
        <div className="layout-content layout-content-offset flex flex-col flex-1 w-full min-w-0">
          {/* Fixed Header - Stays at top */}
          <header className="layout-header layout-header-fixed bg-white border-b border-gray-200 shadow-elevation-1 fixed right-0 top-0 h-header z-30">
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
