// components/ui/StatCard.tsx

type StatCardProps = {
  label: string;
  value: string | number;
  description?: string;
};

export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 px-4 py-4 shadow-lg shadow-black/30">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>

      <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>

      {description && (
        <p className="mt-1 text-[11px] text-slate-400">{description}</p>
      )}
    </div>
  );
}
