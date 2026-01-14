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
  { href: "/export/excel", label: "Export Excel", icon: "📄" },
  { href: "/export/pdf", label: "Export PDF", icon: "🧾" },
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
            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
            active
              ? "bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/30"
              : "text-slate-300 hover:bg-slate-800/70"
          )}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      );
    });

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950/80 border-r border-slate-800/70 backdrop-blur-xl">
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-lg">
            🎓
          </div>
          <div>
            <p className="text-sm font-semibold">Wisuda Admin</p>
            <p className="text-[11px] text-slate-400">Panel Kepegawaian</p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {/* ===== MENU UTAMA ===== */}
        <div>
          <p className="px-2 text-[10px] uppercase tracking-wider text-slate-500">
            Menu Utama
          </p>
          <div className="mt-2 space-y-2">{renderMenu(menuMain)}</div>
        </div>

        {/* PEMISAH */}
        <div className="border-t border-slate-800/60"></div>

        {/* ===== MENU EKSPOR ===== */}
        <div>
          <p className="px-2 text-[10px] uppercase tracking-wider text-slate-500">
            Ekspor Data
          </p>
          <div className="mt-2 space-y-2">{renderMenu(menuExport)}</div>
        </div>
      </nav>
    </aside>
  );
}
