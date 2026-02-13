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

export function AttendanceChart({ data }: Props) {
  // Jika data kosong, tampilkan placeholder premium
  const noData = !data || data.length === 0;

  return (
    <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 tracking-tight">Tren Kehadiran</h3>
          <p className="text-xs text-slate-400 mt-1">Visualisasi data kehadiran real-time</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
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
            <p className="text-slate-400 text-sm font-medium">Belum ada data grafik</p>
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
                stroke="rgba(255,255,255,0.03)"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickMargin={12}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
              />

              <Tooltip
                cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '3 3', strokeOpacity: 0.5 }}
                wrapperStyle={{ outline: "none" }}
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  padding: "8px 12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                }}
                labelStyle={{ color: "#e2e8f0", fontWeight: 600, marginBottom: '4px' }}
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
