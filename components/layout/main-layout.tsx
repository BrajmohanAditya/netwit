"use client";

import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Sidebar + Header Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="layout-content ml-sidebar flex flex-col flex-1">
          {/* Fixed Header */}
          <header
            className="layout-header bg-white border-b border-gray-200 shadow-elevation-1 fixed right-0 top-0 h-header z-30"
            style={{ width: "calc(100% - var(--sidebar-width))" }}
          >
            <Navbar />
          </header>

          {/* Scrollable Main Content */}
          <main className="layout-main bg-white overflow-y-auto flex-1 mt-header p-6">
            <div className="transition-smooth animate-in fade-in slide-in-from-bottom duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
