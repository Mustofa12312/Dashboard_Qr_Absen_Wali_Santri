"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useEvent } from "@/context/EventContext";

type Guardian = {
  id_wali: number;
  nama_wali: string;
  nama_murid: string;
  kelas_murid: string;
  desa?: string | null; // Make optional
};

export default function AbsentPage() {
  const { activeEvent } = useEvent();
  const [absentList, setAbsentList] = useState<Guardian[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      // 1. Ambil semua wali
      const { data: allGuardians } = await supabase
        .from("guardians")
        .select("*");

      // 2. Ambil yang sudah hadir
      const { data: present } = await supabase
        .from("attendances")
        .select("guardian_id")
        .eq("event_name", activeEvent);

      const presentIds = new Set(present?.map((p) => p.guardian_id));

      // 3. Filter yang BELUM hadir
      const notPresent =
        allGuardians?.filter((g) => !presentIds.has(g.id_wali)) || [];

      setAbsentList(notPresent);
    };

    load();
  }, [activeEvent]);

  // ============================
  // FILTER PENCARIAN
  // ============================
  const filtered = absentList.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.id_wali.toString().includes(q) ||
      g.nama_wali.toLowerCase().includes(q) ||
      g.nama_murid.toLowerCase().includes(q) ||
      g.kelas_murid.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
        Wali Para Wisuda yang belum hadir ({activeEvent})
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Cari: wali, murid, kelas, ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field w-full"
      />

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="max-h-[65vh] overflow-y-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50/90 dark:bg-slate-900/80 sticky top-0 z-10">
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Wali</th>
                <th className="px-3 py-2">Murid</th>
                <th className="px-3 py-2">Kelas</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.map((g) => (
                <tr
                  key={g.id_wali}
                  className="hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{g.id_wali}</td>
                  <td className="px-3 py-2 text-slate-800 dark:text-slate-100 font-medium">{g.nama_wali}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{g.nama_murid}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    {g.kelas_murid}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-8 text-center text-slate-500 dark:text-slate-400"
                  >
                    Semua wali sudah hadir 🎉
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
