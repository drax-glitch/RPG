import React, { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import * as api from "../api/api";

export default function Settings() {
  const { user, setUser, logout } = useApp();
  const [form, setForm] = useState({
    displayName: user.displayName,
    title: user.title,
    dailyGoal: user.dailyGoal,
  });
  const [notifs, setNotifs] = useState(user.settings);
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    const updated = await api.updateSettings(form);
    setUser(updated);
    setSaving(false);
  };

  const toggleNotif = async (key) => {
    const next = { ...notifs, [key]: !notifs[key] };
    setNotifs(next);
    await api.updateSettings({ [key]: next[key] });
  };

  const handleResetStreak = async () => {
    if (!confirm("Reset your streak to 0?")) return;
    const res = await api.resetStreak();
    setUser({ ...user, streak: res.streak });
  };

  const handleResetCharacter = async () => {
    if (!confirm("This wipes your level, XP, gold, attributes and quests. Continue?")) return;
    const updated = await api.resetCharacter();
    setUser(updated);
  };

  const NOTIF_LABELS = {
    questReminders: "Quest Reminders",
    streakAlerts: "Streak Alerts",
    levelUpCelebrations: "Level Up Celebrations",
    achievementUnlocks: "Achievement Unlocks",
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-2xl text-white flex items-center gap-2">⚙️ Settings</h1>

      <div className="panel p-6">
        <h2 className="text-xs uppercase tracking-wide text-slate-500 mb-4">Profile</h2>
        <div className="space-y-3">
          <Field label="Display Name" value={form.displayName}
            onChange={(v) => setForm({ ...form, displayName: v })} />
          <Field label="Character Title" value={form.title}
            onChange={(v) => setForm({ ...form, title: v })} />
          <Field label="Daily Goal" type="number" value={form.dailyGoal}
            onChange={(v) => setForm({ ...form, dailyGoal: Number(v) })} suffix="quests" />
        </div>
        <button
          onClick={saveProfile}
          disabled={saving}
          className="mt-4 bg-arcane-600 hover:bg-arcane-500 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </div>

      <div className="panel p-6">
        <h2 className="text-xs uppercase tracking-wide text-slate-500 mb-4">Notifications</h2>
        <div className="space-y-4">
          {Object.entries(NOTIF_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{label}</span>
              <button
                onClick={() => toggleNotif(key)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notifs[key] ? "bg-arcane-600" : "bg-ink-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    notifs[key] ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-6 border-rose-900/40">
        <h2 className="text-xs uppercase tracking-wide text-rose-400 mb-4">Danger Zone</h2>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleResetStreak}
            className="text-sm px-4 py-2 rounded-lg border border-orange-600/40 text-orange-400 hover:bg-orange-600/10"
          >
            Reset Streak
          </button>
          <button
            onClick={handleResetCharacter}
            className="text-sm px-4 py-2 rounded-lg border border-rose-600/40 text-rose-400 hover:bg-rose-600/10"
          >
            Reset Character
          </button>
          <button
            onClick={logout}
            className="text-sm px-4 py-2 rounded-lg border border-ink-600 text-slate-400 hover:bg-ink-800"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", suffix }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-slate-400 shrink-0">{label}</label>
      <div className="flex items-center gap-2 bg-ink-800 border border-ink-700 rounded-lg px-3 py-1.5">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-sm text-right text-slate-100 focus:outline-none w-40"
        />
        {suffix && <span className="text-xs text-slate-500">{suffix}</span>}
      </div>
    </div>
  );
}
