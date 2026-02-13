"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";
import { ExportCard } from "@/components/export/ExportCard";
import { exportToExcel, exportToPdf } from "@/lib/exportUtils";
import { useToast } from "@/components/ui/Toast";

import { useEvent } from "@/context/EventContext";

export default function ExportPage() {
    const { activeEvent } = useEvent();
    const [loadingType, setLoadingType] = useState<"excel" | "pdf" | null>(null);
    const { showToast } = useToast();

    const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleExport = async (type: "excel" | "pdf") => {
        setLoadingType(type);
        try {
            if (type === "excel") {
                await exportToExcel(supabase, activeEvent, (msg) => showToast(msg, "info"));
                showToast("Laporan Excel berhasil diunduh!", "success");
            } else {
                await exportToPdf(supabase, activeEvent, (msg) => showToast(msg, "info"));
                showToast("Laporan PDF berhasil diunduh!", "success");
            }
        } catch (error) {
            console.error(error);
            showToast("Gagal mengunduh laporan. Coba lagi.", "error");
        } finally {
            setLoadingType(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-xl font-bold text-slate-100 tracking-tight">Pusat Laporan</h2>
                <p className="text-sm text-slate-400 mt-1">Unduh rekapitulasi kehadiran dalam format resmi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ExportCard
                    title="Laporan Excel"
                    description="Format spreadsheet (.xlsx) lengkap dengan detail wali dan filter kehadiran."
                    icon="📊"
                    colorClass="bg-emerald-500"
                    onClick={() => handleExport("excel")}
                    isLoading={loadingType === "excel"}
                    disabled={loadingType !== null && loadingType !== "excel"}
                />

                <ExportCard
                    title="Laporan PDF"
                    description="Dokumen siap cetak (.pdf) dengan tata letak surat resmi dan kop."
                    icon="📑"
                    colorClass="bg-red-500"
                    onClick={() => handleExport("pdf")}
                    isLoading={loadingType === "pdf"}
                    disabled={loadingType !== null && loadingType !== "pdf"}
                />

                {/* Placeholder untuk laporan lain di masa depan */}
                <div className="rounded-2xl border border-white/5 border-dashed p-6 flex flex-col items-center justify-center text-center opacity-50 select-none">
                    <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-xl mb-3 text-slate-500">
                        ➕
                    </div>
                    <p className="text-sm font-medium text-slate-400">Laporan Lainnya</p>
                    <p className="text-xs text-slate-600">Segera Hadir</p>
                </div>
            </div>
        </div>
    );
}
