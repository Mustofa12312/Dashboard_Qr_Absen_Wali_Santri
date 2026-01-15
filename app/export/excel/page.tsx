"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ACTIVE_EVENT } from "@/lib/constants";

export default function ExportExcelPage() {
  useEffect(() => {
    const generateExcel = async () => {
      // 1️⃣ Ambil semua wali
      const { data: guardians } = await supabase
        .from("guardians")
        .select("*")
        .order("id_wali");

      // 2️⃣ Ambil wali yang hadir di EVENT AKTIF
      const { data: present } = await supabase
        .from("attendances")
        .select("guardian_id")
        .eq("event_name", ACTIVE_EVENT);

      const presentIds = present?.map((p) => p.guardian_id) ?? [];

      // 3️⃣ Gabungkan data
      const rows =
        guardians?.map((g, index) => ({
          NO: index + 1,
          ID_WALI: g.id_wali,
          NAMA_WALI: g.nama_wali,
          NAMA_MURID: g.nama_murid,
          KELAS: g.kelas_murid,
          STATUS: presentIds.includes(g.id_wali)
            ? "Hadir"
            : "Tidak Hadir",
        })) ?? [];

      // 4️⃣ Buat Excel
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows);

      XLSX.utils.book_append_sheet(wb, ws, "Laporan Kehadiran");

      const buffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });

      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `laporan_kehadiran_${ACTIVE_EVENT}.xlsx`
      );
    };

    generateExcel();
  }, []);

  return (
    <div className="p-6 text-center text-slate-200">
      <h2 className="text-lg font-semibold">
        Menyiapkan Excel ({ACTIVE_EVENT})...
      </h2>
      <p className="text-sm text-slate-400">
        File akan terunduh otomatis.
      </p>
    </div>
  );
}
