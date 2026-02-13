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
    <header className="flex items-center justify-between px-6 py-4 glass sticky top-0 z-20 border-b-0 border-white/5">
      <div>
        <h2 className="text-lg font-bold text-slate-100 tracking-tight">
          Dashboard Wisuda
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          Monitoring kehadiran wali santri
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
          ● Live Status
        </div>
        <button
          onClick={handleLogout}
          className="rounded-xl bg-slate-800/50 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition-all duration-300"
        >
          Keluar
        </button>
      </div>
    </header>
  );
}
