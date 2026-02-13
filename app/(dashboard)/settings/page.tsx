"use client";

import { useState, useEffect } from "react";
import { useEvent } from "@/context/EventContext";
import { useToast } from "@/components/ui/Toast";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function SettingsPage() {
    const { activeEvent, setEvent } = useEvent();
    const { showToast } = useToast();
    const [inputVal, setInputVal] = useState("");

    useEffect(() => {
        setInputVal(activeEvent);
    }, [activeEvent]);

    const handleSave = () => {
        if (!inputVal.trim()) {
            showToast("Nama event tidak boleh kosong", "error");
            return;
        }
        setEvent(inputVal.trim());
        showToast("Pengaturan berhasil disimpan!", "success");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Pengaturan Aplikasi</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Konfigurasi event dan sistem.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800/50">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <span>📅</span> Pengaturan Event
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2">
                            Nama Event Aktif
                        </label>
                        <div className="flex gap-3">
                            <input
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                className="input-field flex-1"
                                placeholder="Contoh: Wisuda Angkatan 5"
                            />
                            <button
                                onClick={handleSave}
                                className="bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-900 font-bold px-6 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                            >
                                Simpan
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            Mengubah nama event akan mempengaruhi filter data di Dashboard dan Laporan.
                            Pastikan nama event sesuai dengan data yang ingin ditampilkan.
                        </p>
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800/50">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <span>🎨</span> Tampilan
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Mode Tema</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Sesuaikan tampilan aplikasi dengan kenyamanan mata Anda.</p>
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800/50 opacity-75">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <span>🤖</span> System Info
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Versi Aplikasi</p>
                        <p className="text-slate-700 dark:text-slate-300 font-mono">v1.2.0 (Premium)</p>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Status Database</p>
                        <p className="text-emerald-500 dark:text-emerald-400 font-mono">Connected</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
