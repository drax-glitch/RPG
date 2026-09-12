import React from "react";

export default function StatPill({ icon, value, label, color = "text-amber-400" }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ink-800 border border-ink-700">
      <span className={color}>{icon}</span>
      <div className="leading-tight">
        <p className={`text-sm font-semibold ${color}`}>{value}</p>
        {label && <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>}
      </div>
    </div>
  );
}
