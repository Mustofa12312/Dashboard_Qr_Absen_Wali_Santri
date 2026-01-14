"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { StatCard } from "@/components/ui/StatCard";
import { AttendanceChart } from "@/components/charts/AttendanceChart";

export default function DashboardPage() {
  const [totalGuardians, setTotalGuardians] = useState(0);
  const [totalAttendances, setTotalAttendances] = useState(0);
  const [chartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);

  // ===========================================================
  // LOAD SEMUA DATA DASHBOARD
  // ===========================================================
  const loadStats = async () => {
    // ---- Ambil total wali ----
    const { data: guardiansData } = await supabase
      .from("guardians")
      .select("id_wali");

    const waliCount = guardiansData?.length ?? 0;
    setTotalGuardians(waliCount);

    // ---- Ambil total hadir ----
    const { data: attendData } = await supabase
      .from("attendances")
      .select("id");

    const hadirCount = attendData?.length ?? 0;
    setTotalAttendances(hadirCount);

    // ---- Update chart ----
    if (waliCount > 0) {
      const hadirPercent = Math.round((hadirCount / waliCount) * 100);

      setChartData([
        { label: "Hadir", value: hadirPercent },
        { label: "Belum Hadir", value: 100 - hadirPercent },
      ]);
    } else {
      setChartData([]);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // ===========================================================
  // HITUNG PERSENTASE UTAMA
  // ===========================================================
  const mainPercent =
    totalGuardians === 0
      ? 0
      : Math.round((totalAttendances / totalGuardians) * 100);

  return (
    <div className="space-y-6">
      {/* ====================== STAT CARDS ====================== */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Wali"
          value={totalGuardians}
          description="Jumlah wali yang terdaftar"
        />

        <StatCard
          label="Sudah Hadir"
          value={totalAttendances}
          description="Total kehadiran hari ini"
        />

        <StatCard
          label="Persentase Kehadiran"
          value={`${mainPercent}%`}
          description="Dari jumlah wali terdaftar"
        />
      </div>

      {/* ====================== GRAFIK KEHADIRAN ====================== */}
      <AttendanceChart data={chartData} />
    </div>
  );
}
