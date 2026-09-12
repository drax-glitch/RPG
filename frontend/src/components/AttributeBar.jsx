import React from "react";

const ATTR_META = {
  strength: { label: "Strength", icon: "💪", color: "from-rose-500 to-rose-400" },
  intelligence: { label: "Intelligence", icon: "🧠", color: "from-cyan-500 to-cyan-400" },
  discipline: { label: "Discipline", icon: "🔥", color: "from-orange-500 to-orange-400" },
  creativity: { label: "Creativity", icon: "🎨", color: "from-fuchsia-500 to-fuchsia-400" },
  vitality: { label: "Vitality", icon: "❤️", color: "from-emerald-500 to-emerald-400" },
};

export default function AttributeBar({ name, value, max = 100, compact = false }) {
  const meta = ATTR_META[name] || { label: name, icon: "✨", color: "from-slate-500 to-slate-400" };
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div className={compact ? "mb-3" : "mb-5"}>
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <span className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wide">
          <span>{meta.icon}</span> {meta.label}
        </span>
        <span className="text-slate-300 font-medium">
          {value}
          {!compact && <span className="text-slate-600"> / {max}</span>}
        </span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill bg-gradient-to-r ${meta.color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
