"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { StatCard } from "@/components/ui/StatCard";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { RealtimeChannel } from "@supabase/supabase-js";

import { Skeleton } from "@/components/ui/Skeleton";
import { useEvent } from "@/context/EventContext";

export default function DashboardPage() {
  const { activeEvent } = useEvent();
  const [totalGuardians, setTotalGuardians] = useState(0);
  const [hadirCount, setHadirCount] = useState(0);
  const [chartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // 1. Total Wali
      const { count: total } = await supabase
        .from("guardians")
        .select("*", { count: "exact", head: true });

      // 2. Hadir (Event Aktif)
      // For distinct count, we still need to fetch and process
      const { data: attendances } = await supabase
        .from("attendances")
        .select("guardian_id")
        .eq("event_name", activeEvent);

      const unique = new Set(
        attendances?.map((a) => a.guardian_id)
      );

      const hadir = unique.size;

      setTotalGuardians(total || 0);
      setHadirCount(hadir || 0);

      // 3. Chart Data (Simulasi logic yang sama)
      if ((total || 0) > 0) {
        const percent = Math.round((hadir / (total || 0)) * 100);
        setChartData([
          { label: "Hadir", value: percent },
          { label: "Belum Hadir", value: 100 - percent },
        ]);
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    fetchData();

    // Re-fetch saat activeEvent berubah
    // Note: Kita pasang listener realtime juga
    channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "attendances",
          filter: `event_name=eq.${activeEvent}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [activeEvent]); // Dependency activeEvent penting!

  const percent =
    totalGuardians > 0
      ? ((hadirCount / totalGuardians) * 100).toFixed(1)
      : "0";

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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
          description={`Event ${activeEvent}`}
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
