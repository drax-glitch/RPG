import React, { useEffect, useState } from "react";
import * as api from "../api/api";

export default function Achievements() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.fetchAchievements().then(setData);
  }, []);

  if (!data) return <p className="text-slate-500">Loading achievements…</p>;

  const pct = Math.round((data.unlockedCount / data.totalCount) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-white flex items-center gap-2">🏆 Achievements</h1>
          <p className="text-sm text-slate-500 mt-1">
            {data.unlockedCount} / {data.totalCount} unlocked
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold">
          {pct}% Complete
        </div>
      </div>

      <div className="progress-track h-2.5">
        <div className="progress-fill bg-gradient-to-r from-amber-500 to-amber-300" style={{ width: `${pct}%` }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.achievements.map((a) => (
          <div
            key={a.id}
            className={`panel p-5 flex items-start gap-3 ${!a.unlocked && "opacity-50"}`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                a.unlocked ? "bg-arcane-600/20 border border-arcane-600/40" : "bg-ink-800 border border-ink-700"
              }`}
            >
              {a.unlocked ? a.icon : "🔒"}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">{a.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>
              <p className={`text-xs mt-2 ${a.unlocked ? "text-emerald-400" : "text-slate-600"}`}>
                {a.unlocked ? `✨ +${a.xpReward} XP earned` : `🔒 +${a.xpReward} XP`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
