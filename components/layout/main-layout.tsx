"use client";

import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen flex flex-col relative">
      {/* Fixed Sidebar + Header Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar - Always Visible */}
        <Sidebar />

        {/* Main Content Area - Adjusts for sidebar */}
        <div className="layout-content flex flex-col flex-1 w-full ml-sidebar">
          {/* Fixed Header - Stays at top */}
          <header
            className="layout-header bg-white border-b border-gray-200 shadow-elevation-1 fixed right-0 top-0 h-header z-30"
            style={{ width: "calc(100% - 250px)", left: "250px" }}
          >
            <Navbar />
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
