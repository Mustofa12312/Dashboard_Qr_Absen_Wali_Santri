"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ACTIVE_EVENT } from "@/lib/constants";

type AttendanceRow = {
  id: number;
  guardian_id: number;
  event_name: string;
  scanned_at: string;
  guardians: {
    nama_wali: string;
    nama_murid: string;
    kelas_murid: string;
  };
};

export default function AttendancesPage() {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("attendances")
        .select(
          `
          id,
          guardian_id,
          event_name,
          scanned_at,
          guardians (
            nama_wali,
            nama_murid,
            kelas_murid
          )
        `
        )
        .eq("event_name", ACTIVE_EVENT) // 🔑 FILTER EVENT
        .order("scanned_at", { ascending: false });

      if (!error && data) {
        const normalized = data.map((row: any) => ({
          ...row,
          guardians: Array.isArray(row.guardians)
            ? row.guardians[0]
            : row.guardians,
        }));

        setRows(normalized as AttendanceRow[]);
      }
    };

    load();
  }, []);

  // =============================
  // FILTER PENCARIAN (CLIENT)
  // =============================
  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();

    return (
      r.guardian_id.toString().includes(q) ||
      r.guardians?.nama_wali.toLowerCase().includes(q) ||
      r.guardians?.nama_murid.toLowerCase().includes(q) ||
      r.guardians?.kelas_murid.toLowerCase().includes(q) ||
      new Date(r.scanned_at)
        .toLocaleString("id-ID")
        .toLowerCase()
        .includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-slate-100">
        Log Kehadiran ({ACTIVE_EVENT})
      </h2>

      {/* SEARCH BAR */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Cari: wali, murid, kelas, ID, waktu..."
          className="w-full md:w-64 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="max-h-[60vh] overflow-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/90 sticky top-0 z-10">
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2">Waktu</th>
                <th className="px-3 py-2">ID Wali</th>
                <th className="px-3 py-2">Wali</th>
                <th className="px-3 py-2">Murid</th>
                <th className="px-3 py-2">Kelas</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-slate-800/80 hover:bg-slate-800/60"
                >
                  <td className="px-3 py-2 text-slate-300">
                    {new Date(r.scanned_at).toLocaleString("id-ID")}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {r.guardian_id}
                  </td>
                  <td className="px-3 py-2 text-slate-100">
                    {r.guardians?.nama_wali}
                  </td>
                  <td className="px-3 py-2 text-slate-200">
                    {r.guardians?.nama_murid}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {r.guardians?.kelas_murid}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-400"
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
