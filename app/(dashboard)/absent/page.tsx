"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
      const { data: guardians } = await supabase
        .from("guardians")
        .select("*")
        .order("id_wali");

      const { data: present } = await supabase
        .from("attendances")
        .select("guardian_id");

      const presentIds = present?.map((p) => p.guardian_id) ?? [];

      const absent = guardians?.filter((g) => !presentIds.includes(g.id_wali));

      setRows(absent ?? []);
    };

    load();
  }, []);

  // ============================
  // FILTER / SEARCH
  // ============================
  const filteredRows = rows.filter((g) => {
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
        Daftar Wali Tidak Hadir
      </h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Cari berdasarkan nama wali / murid / ID / kelas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
      />

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
              {filteredRows.map((r) => (
                <tr
                  key={r.id_wali}
                  className="border-t border-slate-800/70 hover:bg-slate-800/60"
                >
                  <td className="px-3 py-2 text-slate-300">{r.id_wali}</td>
                  <td className="px-3 py-2 text-slate-100">{r.nama_wali}</td>
                  <td className="px-3 py-2 text-slate-200">{r.nama_murid}</td>
                  <td className="px-3 py-2 text-slate-300">{r.kelas_murid}</td>
                </tr>
              ))}

              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    Tidak ditemukan data...
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
