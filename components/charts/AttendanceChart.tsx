"use client";

import {
  AreaChart, // Changed
  Area,      // Changed
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  data: { label: string; value: number }[];
};

import { useTheme } from "@/context/ThemeContext";

export function AttendanceChart({ data }: Props) {
  const { theme } = useTheme();
  // Jika data kosong, tampilkan placeholder premium
  const noData = !data || data.length === 0;

  // Chart Colors based on theme
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)";
  const tickColor = theme === "dark" ? "#64748b" : "#94a3b8";
  const tooltipBg = theme === "dark" ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)";
  const tooltipBorder = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const tooltipText = theme === "dark" ? "#e2e8f0" : "#1e293b";

  return (
    <div className="rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/5 p-6 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Tren Kehadiran</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Visualisasi data kehadiran real-time</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Data
        </div>
      </div>

      <div className="h-64 flex items-center justify-center relative">
        {noData ? (
          <div className="flex flex-col items-center justify-center opacity-40">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Belum ada data grafik</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart // Changed from LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: tickColor }}
                tickMargin={12}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 11, fill: tickColor }}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
              />

              <Tooltip
                cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '3 3', strokeOpacity: 0.5 }}
                wrapperStyle={{ outline: "none" }}
                contentStyle={{
                  backgroundColor: tooltipBg,
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "12px",
                  fontSize: "12px",
                  padding: "8px 12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  color: tooltipText // Set default text color for tooltip content
                }}
                labelStyle={{ color: tooltipText, fontWeight: 600, marginBottom: '4px' }}
                itemStyle={{ color: "#34d399" }}
              />

              <Area // Changed from Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
