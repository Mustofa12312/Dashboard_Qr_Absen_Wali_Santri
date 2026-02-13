"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { Topbar } from "./Topbar";

/* ============================
   MENU DATA (Duplikasi dari Sidebar, idealnya di-extract ke constants)
   ============================= */
const menuMain = [
    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/guardians", label: "Data Wali", icon: "👨‍👩‍👧" },
    { href: "/attendances", label: "Kehadiran", icon: "✅" },
    { href: "/absent", label: "Tidak Hadir", icon: "❌" },
];

const menuExport = [
    { href: "/export", label: "Pusat Laporan", icon: "📥" },
];

export function MobileNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Tutup menu saat rute berubah
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const renderMenu = (items: any[]) =>
        items.map((item) => {
            const active = pathname === item.href;
            return (
                <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                    )}
                >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                </Link>
            );
        });

    return (
        <>
            <div className="md:hidden">
                <Topbar onMenuClick={() => setIsOpen(true)} />
            </div>

            {/* OVERLAY BACKDROP */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* DRAWER MENU */}
            <div
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-slate-950/95 border-r border-white/10 shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* HEADER */}
                <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 text-white">
                            🎓
                        </div>
                        <div>
                            <p className="text-base font-bold text-slate-100">Wisuda Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* MENU LIST */}
                <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                    <div>
                        <p className="px-2 text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3">
                            Menu Utama
                        </p>
                        <div className="space-y-1">{renderMenu(menuMain)}</div>
                    </div>

                    <div>
                        <p className="px-2 text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3">
                            Ekspor Data
                        </p>
                        <div className="space-y-1">{renderMenu(menuExport)}</div>
                    </div>
                </nav>

                {/* FOOTER */}
                <div className="p-4 border-t border-white/5">
                    <p className="text-xs text-center text-slate-500">© 2024 Wisuda App</p>
                </div>
            </div>
        </>
    );
}
