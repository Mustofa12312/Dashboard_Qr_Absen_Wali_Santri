"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ACTIVE_EVENT } from "@/lib/constants";

type Guardian = {
  id_wali: number;
  nama_wali: string;
  nama_murid: string;
  kelas_murid: string;
};

export default function AbsentPage() {
  const [rows, setRows] = useState<Guardian[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      // 1️⃣ Ambil semua wali
      const { data: guardians } = await supabase
        .from("guardians")
        .select("id_wali, nama_wali, nama_murid, kelas_murid")
        .order("id_wali");

      // 2️⃣ Ambil wali yang HADIR di EVENT AKTIF
      const { data: present } = await supabase
        .from("attendances")
        .select("guardian_id")
        .eq("event_name", ACTIVE_EVENT);

      const presentIds = present?.map((p) => p.guardian_id) ?? [];

      // 3️⃣ Filter: wali yang BELUM HADIR di event ini
      const absent =
        guardians?.filter((g) => !presentIds.includes(g.id_wali)) ?? [];

      setRows(absent);
    };

    load();
  }, []);

  // ============================
  // FILTER PENCARIAN
  // ============================
  const filtered = rows.filter((g) => {
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
      <h2 className="text-base font-semibold text-slate-100">
        Wali Belum Hadir ({ACTIVE_EVENT})
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Cari: wali, murid, kelas, ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
      />

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="max-h-[65vh] overflow-y-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/80 sticky top-0 z-10">
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Wali</th>
                <th className="px-3 py-2">Murid</th>
                <th className="px-3 py-2">Kelas</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((g) => (
                <tr
                  key={g.id_wali}
                  className="border-t border-slate-800/70 hover:bg-slate-800/60"
                >
                  <td className="px-3 py-2 text-slate-300">{g.id_wali}</td>
                  <td className="px-3 py-2 text-slate-100">{g.nama_wali}</td>
                  <td className="px-3 py-2 text-slate-200">{g.nama_murid}</td>
                  <td className="px-3 py-2 text-slate-300">
                    {g.kelas_murid}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-slate-400"
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
