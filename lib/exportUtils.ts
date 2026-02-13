import { SupabaseClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* =========================================
   GENERATE EXCEL
   ========================================= */
export const exportToExcel = async (
    supabase: SupabaseClient,
    eventName: string,
    onProgress?: (msg: string) => void
) => {
    try {
        if (onProgress) onProgress("Mengambil data...");

        // 1. Fetch Data
        const { data: guardians, error: gError } = await supabase
            .from("guardians")
            .select("*")
            .order("id_wali");

        if (gError) throw gError;

        const { data: attendances, error: aError } = await supabase
            .from("attendances")
            .select("guardian_id")
            .eq("event_name", eventName);

        if (aError) throw aError;

        const presentIds = new Set(attendances?.map((a) => a.guardian_id));

        // 2. Format Data
        const rows =
            guardians?.map((g, index) => ({
                NO: index + 1,
                ID_WALI: g.id_wali,
                NAMA_WALI: g.nama_wali,
                NAMA_MURID: g.nama_murid,
                KELAS: g.kelas_murid,
                STATUS: presentIds.has(g.id_wali) ? "Hadir" : "Tidak Hadir",
            })) ?? [];

        if (onProgress) onProgress("Membuat file Excel...");

        // 3. Create Excel
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(rows);

        // Auto-width columns (simple estimation)
        const wscols = [
            { wch: 5 },  // NO
            { wch: 10 }, // ID
            { wch: 30 }, // NAMA WALI
            { wch: 30 }, // NAMA MURID
            { wch: 15 }, // KELAS
            { wch: 15 }, // STATUS
        ];
        ws["!cols"] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, "Laporan Kehadiran");

        const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, `Laporan_Absen_${eventName}.xlsx`);

        if (onProgress) onProgress("Selesai!");
    } catch (error) {
        console.error("Export Excel Error:", error);
        throw error;
    }
};

/* =========================================
   GENERATE PDF
   ========================================= */
export const exportToPdf = async (
    supabase: SupabaseClient,
    eventName: string,
    onProgress?: (msg: string) => void
) => {
    try {
        if (onProgress) onProgress("Mengambil data...");

        // 1. Fetch Data (Duplicate fetching logic for independence, or could be extracted)
        const { data: guardians, error: gError } = await supabase
            .from("guardians")
            .select("*")
            .order("id_wali");

        if (gError) throw gError;

        const { data: attendances, error: aError } = await supabase
            .from("attendances")
            .select("guardian_id")
            .eq("event_name", eventName);

        if (aError) throw aError;

        const presentIds = new Set(attendances?.map((a) => a.guardian_id));

        // 2. Format Data for AutoTable
        const rows =
            guardians?.map((g, index) => [
                index + 1,
                g.id_wali,
                g.nama_wali,
                g.nama_murid,
                g.kelas_murid,
                presentIds.has(g.id_wali) ? "Hadir" : "Tidak Hadir",
            ]) ?? [];

        if (onProgress) onProgress("Merender PDF...");

        // 3. Create PDF
        const doc = new jsPDF();

        // Header
        doc.setFontSize(16);
        doc.setTextColor(16, 185, 129); // Emerald-500
        doc.text(`Laporan Kehadiran Wali Santri`, 105, 15, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Event: ${eventName} | Dicetak: ${new Date().toLocaleString('id-ID')}`, 105, 22, { align: "center" });

        // Table
        autoTable(doc, {
            startY: 30,
            head: [["No", "ID", "Nama Wali", "Nama Murid", "Kelas", "Status"]],
            body: rows,
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: {
                fillColor: [16, 185, 129], // Emerald-500
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [240, 253, 244] // Emerald-50
            },
            didParseCell: function (data) {
                // Colorize Status Column
                if (data.section === 'body' && data.column.index === 5) {
                    if (data.cell.raw === 'Hadir') {
                        data.cell.styles.textColor = [22, 163, 74]; // Green
                        data.cell.styles.fontStyle = 'bold';
                    } else {
                        data.cell.styles.textColor = [220, 38, 38]; // Red
                    }
                }
            }
        });

        doc.save(`Laporan_Absen_${eventName}.pdf`);

        if (onProgress) onProgress("Selesai!");

    } catch (error) {
        console.error("Export PDF Error:", error);
        throw error;
    }
};
