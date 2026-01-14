"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function Topbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-800/70 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-20">
      <div>
        <h2 className="text-sm font-semibold text-slate-100">
          Dashboard Wisuda
        </h2>
        <p className="text-xs text-slate-400">
          Monitoring kehadiran wali santri
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
      >
        Keluar
      </button>
    </header>
  );
}
