"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type ExportCardProps = {
    title: string;
    description: string;
    icon: ReactNode;
    colorClass: string; // e.g., "bg-green-500"
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
};

export function ExportCard({
    title,
    description,
    icon,
    colorClass,
    onClick,
    isLoading,
    disabled,
}: ExportCardProps) {
    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:scale-[1.02] hover:shadow-2xl group relative overflow-hidden">
            {/* Decorative Blur */}
            <div className={clsx("absolute top-0 left-0 w-full h-1 opacity-50", colorClass)} />
            <div className={clsx("absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10", colorClass)} />

            <div className={clsx("h-16 w-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg ring-1 ring-white/10 dark:ring-white/10", colorClass, "bg-opacity-10 text-slate-800 dark:text-white")}>
                {icon}
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{description}</p>

            <button
                onClick={onClick}
                disabled={disabled || isLoading}
                className={clsx(
                    "w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
                    disabled
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-white/5 hover:border-white/20 active:scale-95"
                )}
            >
                {isLoading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Memproses...</span>
                    </>
                ) : (
                    <>
                        <span>Download</span>
                        <span className="opacity-50">↓</span>
                    </>
                )}
            </button>
        </div>
    );
}
