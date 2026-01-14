"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportPDFPage() {
  useEffect(() => {
    const generatePDF = async () => {
      // ===============================
      // 1. Ambil data dari Supabase
      // ===============================
      const { data: guardians } = await supabase
        .from("guardians")
        .select("*")
        .order("id_wali");

      const { data: present } = await supabase
        .from("attendances")
        .select("guardian_id");

      const presentIds = present?.map((p) => p.guardian_id) ?? [];

      // ===============================
      // 2. Format data tabel
      // ===============================
      const rows = guardians?.map((g, index) => [
        index + 1,
        g.id_wali,
        g.nama_wali,
        g.nama_murid,
        g.kelas_murid,
        presentIds.includes(g.id_wali) ? "Hadir" : "Tidak Hadir",
      ]);

      // ===============================
      // 3. Buat dokumen PDF
      // ===============================
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // ===============================
      // 4. Tambahkan logo yayasan
      // ===============================
      try {
        const img = "/logo.png"; // pastikan file ada di /public
        doc.addImage(img, "PNG", 15, 10, 25, 25);
      } catch (err) {
        console.log("Logo tidak ditemukan");
      }

      // ===============================
      // 5. Judul PDF
      // ===============================
      doc.setFontSize(16);
      doc.text("Laporan Kehadiran Wali Santri", 105, 20, { align: "center" });

      doc.setFontSize(11);
      doc.text("Wisuda Santri - Tahun 2025", 105, 27, { align: "center" });

      doc.setLineWidth(0.4);
      doc.line(15, 38, 195, 38); // garis bawah judul

      // ===============================
      // 6. Tabel otomatis
      // ===============================
      autoTable(doc, {
        startY: 45,
        head: [["No", "ID Wali", "Nama Wali", "Nama Murid", "Kelas", "Status"]],
        body: rows ?? [],
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [34, 197, 94], // hijau seperti tema Anda
          textColor: 255,
        },
      });

      // ===============================
      // 7. Download file PDF
      // ===============================
      doc.save("laporan_kehadiran_wali.pdf");
    };

    generatePDF();
  }, []);

  return (
    <div className="p-6 text-center text-slate-200">
      <h2 className="text-lg font-semibold">Menyiapkan file PDF...</h2>
      <p className="text-sm text-slate-400 mt-1">
        Jika file tidak terunduh otomatis, silakan refresh halaman.
      </p>
    </div>
  );
}
