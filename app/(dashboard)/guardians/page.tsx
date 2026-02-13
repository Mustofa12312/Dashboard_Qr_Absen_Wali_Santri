"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Guardian = {
  id_wali: number;
  nama_wali: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  nama_murid: string;
  kelas_murid: string;
};

import { ManualCheckinButton } from "@/components/actions/ManualCheckinButton";

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // Trigger re-fetch

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("guardians")
        .select("*")
        .order("id_wali", { ascending: true });
      setGuardians((data as Guardian[]) || []);
    };
    load();
  }, [refreshKey]);

  const filtered = guardians.filter((g) => {
    const keyword = search.toLowerCase();
    return (
      g.nama_wali.toLowerCase().includes(keyword) ||
      g.nama_murid.toLowerCase().includes(keyword) ||
      g.desa.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-4">
      {/* ... (Search Input) ... */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Data Wali Murid
        </h2>
        <input
          placeholder="Cari nama wali / murid / desa..."
          className="input-field w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-h-[60vh] overflow-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50/90 dark:bg-slate-900/90 sticky top-0 z-10">
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Wali</th>
                <th className="px-3 py-2">Murid</th>
                <th className="px-3 py-2">Kelas</th>
                <th className="px-3 py-2">Alamat</th>
                <th className="px-3 py-2 text-center">Aksi</th>
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
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{g.kelas_murid}</td>
                  <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                    {g.desa}, {g.kecamatan}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <ManualCheckinButton
                      guardianId={g.id_wali}
                      guardianName={g.nama_wali}
                      onSuccess={() => setRefreshKey(prev => prev + 1)}
                    />
                  </td>
                </tr>
              ))}
              {/* ... (Empty State) ... */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
