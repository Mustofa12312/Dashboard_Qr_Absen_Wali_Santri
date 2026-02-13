"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useEvent } from "@/context/EventContext";

type Attendance = {
  id: number;
  created_at: string; // scanned_at
  guardian: {
    nama_wali: string;
    nama_murid: string;
    kelas_murid: string;
  };
};

export default function AttendancesPage() {
  const { activeEvent } = useEvent();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("attendances")
        .select(
          `
          id,
          created_at,
          guardian:guardians (nama_wali, nama_murid, kelas_murid)
        `
        )
        .eq("event_name", activeEvent) // 🔑 FILTER EVENT
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Transform data (flatten)
        const formatted = data?.map((item: any) => ({
          id: item.id,
          created_at: item.created_at,
          guardian: item.guardian,
        }));

        setAttendances(formatted || []);
      }
    };

    load();
  }, []);

  // =============================
  // FILTER PENCARIAN (CLIENT)
  // =============================
  // =============================
  // FILTER PENCARIAN (CLIENT)
  // =============================
  const filtered = attendances.filter((r) => {
    const q = search.toLowerCase();

    return (
      r.id.toString().includes(q) || // Search by attendance ID or guardian ID if mapped? 
      // r.guardian_id is not in Attendance type definition above. 
      // Wait, Attendance type loop above has 'guardian'. 
      // Check 'formatted' in useEffect: id, created_at, guardian
      // We need to check if we can search by guardian ID. 
      // The guardian object inside attendance doesn't have id_wali explicitly in the select logic?
      // "guardian:guardians (nama_wali...)"
      // Let's check the select query: "guardian:guardians (nama_wali, nama_murid, kelas_murid)"
      // It does NOT select id_wali. 
      // So we can only search by names and class.

      r.guardian.nama_wali.toLowerCase().includes(q) ||
      r.guardian.nama_murid.toLowerCase().includes(q) ||
      r.guardian.kelas_murid.toLowerCase().includes(q) ||
      new Date(r.created_at)
        .toLocaleString("id-ID")
        .toLowerCase()
        .includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
        Log Kehadiran ({activeEvent})
      </h2>

      {/* SEARCH BAR */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Cari: wali, murid, kelas, ID, waktu..."
          className="input-field w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-h-[60vh] overflow-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50/90 dark:bg-slate-900/90 sticky top-0 z-10">
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-2">Waktu</th>
                <th className="px-3 py-2">ID Wali</th>
                <th className="px-3 py-2">Wali</th>
                <th className="px-3 py-2">Murid</th>
                <th className="px-3 py-2">Kelas</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    {new Date(r.created_at).toLocaleString("id-ID")}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    - {/* ID Wali not fetched */}
                  </td>
                  <td className="px-3 py-2 text-slate-800 dark:text-slate-100 font-medium">
                    {r.guardian.nama_wali}
                  </td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200">
                    {r.guardian.nama_murid}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    {r.guardian.kelas_murid}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-slate-500 dark:text-slate-400"
                  >
                    Belum ada data kehadiran untuk event ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
