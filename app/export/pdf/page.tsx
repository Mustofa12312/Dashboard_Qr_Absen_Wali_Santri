"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ACTIVE_EVENT } from "@/lib/constants";

export default function ExportPDFPage() {
  useEffect(() => {
    const generatePDF = async () => {
      // 1️⃣ Ambil semua wali
      const { data: guardians } = await supabase
        .from("guardians")
        .select("*")
        .order("id_wali");

      // 2️⃣ Ambil wali hadir di EVENT AKTIF
      const { data: present } = await supabase
        .from("attendances")
        .select("guardian_id")
        .eq("event_name", ACTIVE_EVENT);

      const presentIds = present?.map((p) => p.guardian_id) ?? [];

      // 3️⃣ Siapkan tabel
      const rows =
        guardians?.map((g, index) => [
          index + 1,
          g.id_wali,
          g.nama_wali,
          g.nama_murid,
          g.kelas_murid,
          presentIds.includes(g.id_wali)
            ? "Hadir"
            : "Tidak Hadir",
        ]) ?? [];

      // 4️⃣ Buat PDF
      const doc = new jsPDF();

      doc.setFontSize(14);
      doc.text(
        `Laporan Kehadiran Wali Santri`,
        105,
        15,
        { align: "center" }
      );

      doc.setFontSize(11);
      doc.text(
        `Event: ${ACTIVE_EVENT}`,
        105,
        22,
        { align: "center" }
      );

      autoTable(doc, {
        startY: 30,
        head: [
          ["No", "ID Wali", "Nama Wali", "Nama Murid", "Kelas", "Status"],
        ],
        body: rows,
        styles: { fontSize: 9 },
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: 255,
        },
      });

      doc.save(`laporan_kehadiran_${ACTIVE_EVENT}.pdf`);
    };

    generatePDF();
  }, []);

  return (
    <div className="p-6 text-center text-slate-200">
      <h2 className="text-lg font-semibold">
        Menyiapkan PDF ({ACTIVE_EVENT})...
      </h2>
      <p className="text-sm text-slate-400">
        File akan terunduh otomatis.
      </p>
    </div>
  );
}
