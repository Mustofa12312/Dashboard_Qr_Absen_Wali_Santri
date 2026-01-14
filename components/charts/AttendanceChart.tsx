"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  data: { label: string; value: number }[];
};

export function AttendanceChart({ data }: Props) {
  // Jika data kosong, tampilkan placeholder premium
  const noData = !data || data.length === 0;

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg shadow-black/30">
      <p className="text-sm font-semibold text-slate-100 mb-3">
        Tren Kehadiran
      </p>

      <div className="h-60 flex items-center justify-center">
        {noData ? (
          <p className="text-slate-500 text-xs">Belum ada data grafik.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickMargin={6}
                axisLine={false}
              />

              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickMargin={6}
              />

              <Tooltip
                wrapperStyle={{ outline: "none" }}
                contentStyle={{
                  backgroundColor: "rgba(2, 6, 23, 0.9)",
                  border: "1px solid #1f2937",
                  borderRadius: "10px",
                  fontSize: "12px",
                  padding: "6px 10px",
                }}
                labelStyle={{ color: "#fff", fontWeight: 600 }}
                itemStyle={{ color: "#22c55e" }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2.4}
                dot={{
                  r: 3,
                  stroke: "#22c55e",
                  strokeWidth: 1,
                  fill: "#0f172a",
                }}
                activeDot={{
                  r: 5,
                  stroke: "#22c55e",
                  strokeWidth: 2,
                  fill: "#22c55e",
                }}
                animationDuration={700}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
