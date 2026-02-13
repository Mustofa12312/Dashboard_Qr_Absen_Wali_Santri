"use client";

import { useTheme } from "@/context/ThemeContext";
import clsx from "clsx";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={clsx(
                "relative h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
                theme === "dark" ? "bg-slate-700" : "bg-slate-200"
            )}
        >
            <span className="sr-only">Ganti Tema</span>
            <span
                className={clsx(
                    "absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center text-xs",
                    theme === "dark" ? "translate-x-8" : "translate-x-0"
                )}
            >
                {theme === "dark" ? "🌙" : "☀️"}
            </span>
        </button>
    );
}
