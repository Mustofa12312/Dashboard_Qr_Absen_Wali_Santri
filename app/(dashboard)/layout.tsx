"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.replace("/login");
      else setChecking(false);
    };
    check();
  }, []);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-300">
        Memeriksa sesi...
      </div>
    );
  }

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
