"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

/* ============================
   MENU UTAMA
============================= */
const menuMain = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/guardians", label: "Data Wali", icon: "👨‍👩‍👧" },
  { href: "/attendances", label: "Kehadiran", icon: "✅" },
  { href: "/absent", label: "Tidak Hadir", icon: "❌" },
];

/* ============================
   MENU EKSPOR
============================= */
const menuExport = [
  { href: "/export", label: "Pusat Laporan", icon: "📥" },
];

export function Sidebar() {
  const pathname = usePathname();

  const renderMenu = (items: any[]) =>
    items.map((item) => {
      const active = pathname === item.href;

      return (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 group",
            active
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-500/20"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:pl-4"
          )}
        >
          <span className={clsx("text-lg transition-transform", active ? "scale-110" : "group-hover:scale-110")}>{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </Link>
      );
    });

  return (
    <aside className="hidden md:flex flex-col w-64 glass border-r-0 h-screen sticky top-0 transition-colors duration-300">
      {/* HEADER */}
      <div className="px-6 py-6 border-b border-slate-200/50 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 text-white">
            🎓
          </div>
          <div>
            <p className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">Wisuda Admin</p>
            <p className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-500 font-semibold">Panel Kepegawaian</p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
        {/* ===== MENU UTAMA ===== */}
        <div>
          <p className="px-2 text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3">
            Menu Utama
          </p>
          <div className="space-y-1">{renderMenu(menuMain)}</div>
        </div>

        {/* ===== MENU EKSPOR ===== */}
        <div>
          <p className="px-2 text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3">
            Ekspor Data
          </p>
          <div className="space-y-1">{renderMenu(menuExport)}</div>
        </div>

        {/* ===== PENGATURAN ===== */}
        <div>
          <div className="space-y-1">
            <Link
              href="/settings"
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 group",
                pathname === "/settings"
                  ? "bg-slate-800 text-slate-200 border border-slate-700"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 hover:pl-4"
              )}
            >
              <span className="text-lg">⚙️</span>
              <span className="font-medium">Pengaturan</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* FOOTER */}
      <div className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 border border-white/5 backdrop-blur-sm">
          <p className="text-xs text-slate-400 text-center">© 2024 Wisuda Dashboard</p>
        </div>
      </div>
    </aside >
  );
}
