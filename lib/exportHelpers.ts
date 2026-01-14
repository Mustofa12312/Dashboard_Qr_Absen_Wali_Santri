import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ===========================================================
// EXPORT EXCEL
// ===========================================================
export function exportToExcel(rows: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${filename}.xlsx`);
}

// ===========================================================
// EXPORT PDF
// ===========================================================
export function exportToPDF(columns: string[], rows: any[], filename: string) {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [columns],
    body: rows,
    styles: { fontSize: 8 },
  });

  doc.save(`${filename}.pdf`);
}
