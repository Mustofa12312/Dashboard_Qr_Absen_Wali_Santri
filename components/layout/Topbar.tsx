"use client";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 glass sticky top-0 z-20 border-b-0 border-white/5">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Dashboard Wisuda
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
            Monitoring kehadiran wali santri
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
          ● Live Status
        </div>
        <button
          onClick={handleLogout}
          className="rounded-xl bg-slate-200/50 dark:bg-slate-800/50 hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/30 border border-slate-300/50 dark:border-white/10 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all duration-300"
        >
          Keluar
        </button>
      </div>
    </header>
  );
}
