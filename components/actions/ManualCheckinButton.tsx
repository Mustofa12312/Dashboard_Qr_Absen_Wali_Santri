"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";
import { useToast } from "@/components/ui/Toast";
import { useEvent } from "@/context/EventContext";

type ManualCheckinButtonProps = {
    guardianId: number;
    guardianName: string;
    onSuccess?: () => void;
};

export function ManualCheckinButton({ guardianId, guardianName, onSuccess }: ManualCheckinButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
    const { activeEvent } = useEvent();

    const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleCheckin = async () => {
        if (!confirm(`Konfirmasi check-in manual untuk:\n${guardianName} di event ${activeEvent}?`)) return;

        setIsLoading(true);

        try {
            // 1. Cek apakah sudah absen
            const { data: existing } = await supabase
                .from("attendances")
                .select("id")
                .eq("guardian_id", guardianId)
                .eq("event_name", activeEvent)
                .single();

            if (existing) {
                showToast("Wali ini sudah check-in sebelumnya.", "info");
                setIsLoading(false);
                return;
            }

            // 2. Insert Absen
            const { error } = await supabase.from("attendances").insert({
                guardian_id: guardianId,
                event_name: activeEvent,
                method: "MANUAL", // Menandai bahwa ini manual
            });

            if (error) throw error;

            showToast(`Berhasil check-in: ${guardianName}`, "success");
            if (onSuccess) onSuccess();

        } catch (error) {
            console.error("Manual Checkin Error:", error);
            showToast("Gagal melakukan check-in.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckin}
            disabled={isLoading}
            className="rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50"
            title="Check-in Manual"
        >
            {isLoading ? "..." : "Check-in"}
        </button>
    );
}
