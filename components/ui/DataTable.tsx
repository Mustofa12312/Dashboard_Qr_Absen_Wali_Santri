// components/ui/DataTable.tsx
import React from "react";
import clsx from "clsx";

type Column<T> = {
  key: keyof T;
  label: string;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  emptyText?: string;
};

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField = "id",
  emptyText = "Tidak ada data",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg shadow-black/30">
      <div className="max-h-[65vh] overflow-auto">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 bg-slate-900/95 z-10">
            <tr className="text-slate-400 uppercase text-[11px] tracking-wider">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={clsx("px-3 py-2 text-left", col.className)}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-6 text-center text-slate-500"
                >
                  {emptyText}
                </td>
              </tr>
            )}

            {data.map((row) => (
              <tr
                key={String(row[keyField])}
                className="border-t border-slate-800/70 hover:bg-slate-800/60 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={clsx("px-3 py-2 text-slate-200", col.className)}
                  >
                    {String(row[col.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
