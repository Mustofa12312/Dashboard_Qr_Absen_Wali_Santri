"use client";

import type { ReactNode } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Desktop Sidebar */}
      <Sidebar />

      <main className="flex-1 flex flex-col min-h-0">
        {/* Desktop Topbar */}
        <div className="hidden md:block">
          <Topbar />
        </div>

        {/* Mobile Navigation (Includes Topbar) */}
        <MobileNav />

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
