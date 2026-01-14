"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExportExcelPage() {
  useEffect(() => {
    const generateExcel = async () => {
      // -------------------------------------------------
      // 1. Ambil data dari Supabase
      // -------------------------------------------------
      const { data: guardians } = await supabase
        .from("guardians")
        .select("*")
        .order("id_wali");

      const { data: present } = await supabase
        .from("attendances")
        .select("guardian_id");

      const presentIds = present?.map((p) => p.guardian_id) ?? [];

      const rows =
        guardians?.map((g, index) => ({
          NO: index + 1,
          ID_WALI: g.id_wali,
          NAMA_WALI: g.nama_wali,
          NAMA_MURID: g.nama_murid,
          KELAS: g.kelas_murid,
          STATUS: presentIds.includes(g.id_wali) ? "Hadir" : "Tidak Hadir",
        })) ?? [];

      // -------------------------------------------------
      // 2. Workbook & sheet kosong
      // -------------------------------------------------
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([]);

      // -------------------------------------------------
      // 3. Logo Yayasan
      // -------------------------------------------------
      const logoImage = await fetch("/logo.png")
        .then((r) => r.blob())
        .then(
          (b) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(b);
            })
        );

      ws["!images"] = [
        {
          data: logoImage,
          type: "picture",
          position: {
            type: "twoCellAnchor",
            from: { r: 0, c: 0 },
            to: { r: 6, c: 2 },
          },
        },
      ];

      // -------------------------------------------------
      // 4. Judul
      // -------------------------------------------------
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          ["", "", "LAPORAN KEHADIRAN WALI SANTRI"],
          ["", "", "WISUDA SANTRI - 2025"],
          [],
        ],
        { origin: "A7" }
      );

      ws["C7"].s = { font: { bold: true, sz: 18 } };
      ws["C8"].s = { font: { bold: true, sz: 14 } };

      // -------------------------------------------------
      // 5. Header tabel
      // -------------------------------------------------
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          ["No", "ID Wali", "Nama Wali", "Nama Murid", "Kelas", "Status"],
          ...rows.map((r) => Object.values(r)),
        ],
        { origin: "A10" }
      );

      // -------------------------------------------------
      // 6. Style Header (Hijau)
      // -------------------------------------------------
      const headerCells = ["A10", "B10", "C10", "D10", "E10", "F10"];
      headerCells.forEach((cell) => {
        ws[cell].s = {
          fill: { fgColor: { rgb: "22C55E" } },
          font: { bold: true, color: { rgb: "FFFFFF" } },
          alignment: { horizontal: "center" },
        };
      });

      // -------------------------------------------------
      // 7. Pewarnaan Baris “Tidak Hadir”
      // -------------------------------------------------
      rows.forEach((row, index) => {
        const excelRow = index + 11; // Header di baris 10 → data mulai 11

        if (row.STATUS === "Tidak Hadir") {
          // Kolom A–F
          ["A", "B", "C", "D", "E", "F"].forEach((col) => {
            const cell = ws[`${col}${excelRow}`];
            if (!cell) return;

            cell.s = {
              fill: { fgColor: { rgb: "FECACA" } }, // Background merah soft
              font: { color: { rgb: "B91C1C" }, bold: false }, // Teks merah tua
            };
          });
        }
      });

      // -------------------------------------------------
      // 8. Auto width
      // -------------------------------------------------
      ws["!cols"] = [
        { wch: 5 },
        { wch: 10 },
        { wch: 25 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
      ];

      // -------------------------------------------------
      // 9. Simpan file
      // -------------------------------------------------
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Kehadiran");

      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });

      saveAs(
        new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        "laporan_kehadiran.xlsx"
      );
    };

    generateExcel();
  }, []);

  return (
    <div className="p-6 text-center text-slate-200">
      <h2 className="text-lg font-semibold">Menyiapkan file Excel...</h2>
      <p className="text-sm text-slate-400">
        Jika file tidak otomatis terunduh, silakan refresh halaman.
      </p>
    </div>
  );
}
