"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { StatCard } from "@/components/ui/StatCard";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { ACTIVE_EVENT } from "@/lib/constants";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [totalGuardians, setTotalGuardians] = useState(0);
  const [hadirCount, setHadirCount] = useState(0);
  const [chartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const loadStats = async () => {
      // 1️⃣ TOTAL WALI
      const { data: guardians } = await supabase
        .from("guardians")
        .select("id_wali");

      const total = guardians?.length ?? 0;
      setTotalGuardians(total);

      // 2️⃣ TOTAL HADIR (DISTINCT + EVENT)
      const { data: attendances } = await supabase
        .from("attendances")
        .select("guardian_id")
        .eq("event_name", ACTIVE_EVENT);

      const unique = new Set(
        attendances?.map((a) => a.guardian_id)
      );

      const hadir = unique.size;
      setHadirCount(hadir);

      // 3️⃣ DATA GRAFIK
      if (total > 0) {
        const percent = Math.round((hadir / total) * 100);
        setChartData([
          { label: "Hadir", value: percent },
          { label: "Belum Hadir", value: 100 - percent },
        ]);
      } else {
        setChartData([]);
      }
    };

    // 🔹 LOAD AWAL
    loadStats();

    // 🔴 REALTIME LISTENER + DEBUG
    channel = supabase
      .channel("realtime-attendances")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "attendances",
          filter: `event_name=eq.${ACTIVE_EVENT}`,
        },
        (payload) => {
          console.log("🔥 REALTIME MASUK:", payload);
          loadStats();
        }
      )
      .subscribe((status) => {
        console.log("📡 Realtime status:", status);
      });

    // 🔹 CLEANUP (DEV-SAFE)
    return () => {
      // ❗ Jangan remove channel saat development (Fast Refresh)
      if (process.env.NODE_ENV === "production" && channel) {
        console.log("🧹 Realtime channel removed (production)");
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const percent =
    totalGuardians === 0
      ? 0
      : Math.round((hadirCount / totalGuardians) * 100);

  return (
    <div className="space-y-6">
      {/* STAT CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Wali"
          value={totalGuardians}
          description="Jumlah wali terdaftar"
          icon="👥"
        />

        <StatCard
          label="Sudah Hadir"
          value={hadirCount}
          description={`Event ${ACTIVE_EVENT}`}
          icon="✅"
        />

        <StatCard
          label="Persentase Kehadiran"
          value={`${percent}%`}
          description="Dari total wali"
          icon="📈"
        />
      </div>

      {/* GRAFIK */}
      <AttendanceChart data={chartData} />
    </div>
  );
}
