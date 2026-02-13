"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Topbar />
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          {children}
        </div>
      </main>
    </div>
  );
}
