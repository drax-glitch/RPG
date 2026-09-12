import React, { useEffect, useState, useCallback } from "react";
import { Plus, X } from "lucide-react";
import * as api from "../api/api";
import { useApp } from "../context/AppContext.jsx";
import QuestCard from "../components/QuestCard.jsx";

const STATUS_TABS = ["All", "Active", "Completed"];
const CATEGORY_TABS = ["All", "Learning", "Health", "Creative", "Wellness", "Work"];
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const ATTRIBUTES = ["Strength", "Intelligence", "Discipline", "Creativity", "Vitality"];

export default function Quests() {
  const { setUser } = useApp();
  const [quests, setQuests] = useState([]);
  const [statusTab, setStatusTab] = useState("All");
  const [categoryTab, setCategoryTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", category: "Learning", difficulty: "EASY", attribute: "Intelligence", dueLabel: "Today",
  });

  const load = useCallback(async () => {
    const status = statusTab === "All" ? undefined : statusTab.toUpperCase();
    const data = await api.fetchQuests({ status, category: categoryTab });
    setQuests(data);
  }, [statusTab, categoryTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleComplete = async (id) => {
    const result = await api.completeQuest(id);
    setUser(result.user);
    await load();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await api.createQuest(form);
    setForm({ title: "", category: "Learning", difficulty: "EASY", attribute: "Intelligence", dueLabel: "Today" });
    setShowForm(false);
    await load();
  };

  const activeCount = quests.filter((q) => q.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-white flex items-center gap-2">📜 Quest Log</h1>
          <p className="text-sm text-slate-500 mt-1">{activeCount} active quests</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-arcane-600 hover:bg-arcane-500 transition-colors text-white text-sm px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> New Quest
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setStatusTab(t)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              statusTab === t
                ? "bg-arcane-600/20 text-arcane-400 border-arcane-600/40"
                : "bg-ink-800 text-slate-400 border-ink-700 hover:text-slate-200"
            }`}
          >
            {t}
          </button>
        ))}
        <span className="w-px h-5 bg-ink-700 mx-1" />
        {CATEGORY_TABS.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryTab(c)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              categoryTab === c
                ? "bg-ink-700 text-slate-100 border-ink-600"
                : "bg-ink-800 text-slate-500 border-ink-700 hover:text-slate-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="panel p-6 space-y-3">
        {quests.map((q) => (
          <QuestCard key={q.id} quest={q} onComplete={handleComplete} />
        ))}
        {quests.length === 0 && (
          <p className="text-sm text-slate-500 py-10 text-center">No quests match this filter.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="panel bg-ink-900 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-white">New Quest</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-300">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                autoFocus
                placeholder="Quest title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-arcane-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-sm"
                >
                  {CATEGORY_TABS.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-sm"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.attribute}
                  onChange={(e) => setForm({ ...form, attribute: e.target.value })}
                  className="bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-sm"
                >
                  {ATTRIBUTES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <select
                  value={form.dueLabel}
                  onChange={(e) => setForm({ ...form, dueLabel: e.target.value })}
                  className="bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-sm"
                >
                  {["Today", "Tomorrow", "This Week"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-arcane-600 hover:bg-arcane-500 transition-colors text-white text-sm font-medium py-2.5 rounded-lg"
              >
                Add Quest
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
