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

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("guardians")
        .select("*")
        .order("id_wali", { ascending: true });
      setGuardians((data as Guardian[]) || []);
    };
    load();
  }, []);

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-100">
          Data Wali Murid
        </h2>
        <input
          placeholder="Cari nama wali / murid / desa..."
          className="w-full md:w-64 rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-emerald-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="max-h-[60vh] overflow-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/90 sticky top-0 z-10">
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Wali</th>
                <th className="px-3 py-2">Murid</th>
                <th className="px-3 py-2">Kelas</th>
                <th className="px-3 py-2">Alamat</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr
                  key={g.id_wali}
                  className="border-t border-slate-800/80 hover:bg-slate-800/60"
                >
                  <td className="px-3 py-2 text-slate-300">{g.id_wali}</td>
                  <td className="px-3 py-2 text-slate-100">{g.nama_wali}</td>
                  <td className="px-3 py-2 text-slate-200">{g.nama_murid}</td>
                  <td className="px-3 py-2 text-slate-300">{g.kelas_murid}</td>
                  <td className="px-3 py-2 text-slate-400">
                    {g.desa}, {g.kecamatan}, {g.kabupaten}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    Tidak ada data yang cocok.
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
