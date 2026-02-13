// components/ui/StatCard.tsx

import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
};

export function StatCard({ label, value, description, icon }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 shadow-lg shadow-black/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300">
      <div className="absolute top-0 right-0 p-4 opacity-50 text-6xl text-white/5 saturate-0 group-hover:text-emerald-500/10 transition-colors pointer-events-none select-none">
        {icon}
      </div>

      <div className="relative flex justify-between items-start z-10">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-100 tracking-tight">{value}</p>
        </div>

        {icon && (
          <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xl text-emerald-400 shadow-inner group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
            {icon}
          </div>
        )}
      </div>

      {description && (
        <div className="relative mt-4 flex items-center gap-2">
          <div className="h-1 w-8 rounded-full bg-emerald-500/30 group-hover:w-12 transition-all duration-500" />
          <p className="text-xs text-slate-500 group-hover:text-emerald-400/80 transition-colors">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
