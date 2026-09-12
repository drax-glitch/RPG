import React, { useEffect, useState } from "react";
import { Zap, Coins, Flame, ScrollText } from "lucide-react";
import * as api from "../api/api";
import AttributeBar from "../components/AttributeBar.jsx";

const SLOT_ICONS = { Weapons: "⚔️", Magic: "🛡️", Badges: "💍", Frames: "🖼️" };

export default function Character() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.fetchCharacter().then(setData);
  }, []);

  if (!data) return <p className="text-slate-500">Loading character sheet…</p>;

  const { user, attributes, equipped } = data;
  const equippedBySlot = Object.fromEntries(equipped.map((e) => [e.category, e]));
  const slots = ["Weapons", "Magic", "Badges", "Frames"];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-white flex items-center gap-2">🧝 Character Sheet</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: identity card */}
        <div className="panel p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-arcane-500 to-blue-500 flex items-center justify-center text-5xl mb-4">
              {user.avatar}
            </div>
            <h2 className="font-display text-xl text-white">{user.displayName}</h2>
            <p className="text-sm text-arcane-400 mt-1">{user.title}</p>

            <div className="w-full mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>LVL {user.level}</span>
                <span>{user.xp} / {user.xpToNext} XP</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill bg-gradient-to-r from-arcane-500 to-blue-400"
                  style={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mt-6">
              <StatBox icon={<Zap size={16} className="text-arcane-400" />} value={user.level} label="Level" />
              <StatBox icon={<Coins size={16} className="text-amber-400" />} value={user.gold.toLocaleString()} label="Gold" />
              <StatBox icon={<Flame size={16} className="text-orange-400" />} value={`${user.streak}d`} label="Streak" />
              <StatBox icon={<ScrollText size={16} className="text-emerald-400" />} value={user.questsDone} label="Quests" />
            </div>
          </div>
        </div>

        {/* Right: attributes */}
        <div className="panel p-6">
          <h2 className="font-display text-lg text-white flex items-center gap-2 mb-5">
            <Zap size={17} className="text-amber-400" /> Core Attributes
          </h2>
          {Object.entries(attributes).map(([key, value]) => (
            <AttributeBar key={key} name={key} value={value} />
          ))}
        </div>
      </div>

      {/* Equipped items */}
      <div className="panel p-6">
        <h2 className="font-display text-lg text-white flex items-center gap-2 mb-4">🎒 Equipped Items</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {slots.map((slot) => {
            const item = equippedBySlot[slot];
            return (
              <div
                key={slot}
                className="aspect-square rounded-xl bg-ink-800 border border-ink-700 flex flex-col items-center justify-center gap-2 text-slate-600"
              >
                <span className="text-2xl">{item ? item.icon : SLOT_ICONS[slot]}</span>
                <span className="text-[11px] text-slate-500">{item ? item.name : "Empty"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, value, label }) {
  return (
    <div className="bg-ink-800 border border-ink-700 rounded-lg p-3 flex flex-col items-center">
      {icon}
      <p className="text-sm font-semibold text-slate-100 mt-1">{value}</p>
      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}
