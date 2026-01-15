"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { StatCard } from "@/components/ui/StatCard";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { ACTIVE_EVENT } from "@/lib/constants";

export default function DashboardPage() {
  const [totalGuardians, setTotalGuardians] = useState(0);
  const [hadirCount, setHadirCount] = useState(0);
  const [chartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    const loadStats = async () => {
      // 1️⃣ TOTAL WALI
      const { data: guardians } = await supabase
        .from("guardians")
        .select("id_wali");

      const total = guardians?.length ?? 0;
      setTotalGuardians(total);

      // 2️⃣ TOTAL HADIR (DISTINCT, BERDASARKAN EVENT)
      const { data: attendances } = await supabase
        .from("attendances")
        .select("guardian_id")
        .eq("event_name", ACTIVE_EVENT);

      const uniqueGuardians = new Set(
        attendances?.map((a) => a.guardian_id)
      );

      const hadir = uniqueGuardians.size;
      setHadirCount(hadir);

      // 3️⃣ DATA GRAFIK
      if (total > 0) {
        const percentHadir = Math.round((hadir / total) * 100);

        setChartData([
          { label: "Hadir", value: percentHadir },
          { label: "Belum Hadir", value: 100 - percentHadir },
        ]);
      } else {
        setChartData([]);
      }
    };

    loadStats();
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
        />

        <StatCard
          label="Sudah Hadir"
          value={hadirCount}
          description={`Event ${ACTIVE_EVENT}`}
        />

        <StatCard
          label="Persentase Kehadiran"
          value={`${percent}%`}
          description="Dari total wali"
        />
      </div>

      {/* GRAFIK */}
      <AttendanceChart data={chartData} />
    </div>
  );
}
