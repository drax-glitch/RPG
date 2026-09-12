import React, { useEffect, useState, useCallback } from "react";
import { Coins, Flame, CheckSquare, Plus, Zap, Trophy, Sparkles, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import * as api from "../api/api";
import QuestCard from "../components/QuestCard.jsx";
import AttributeBar from "../components/AttributeBar.jsx";
import StatPill from "../components/StatPill.jsx";

const CATEGORIES = ["Work", "Learning", "Health", "Creative", "Wellness"];
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const ATTRIBUTES = ["Strength", "Intelligence", "Discipline", "Creativity", "Vitality"];

export default function Dashboard() {
  const { user, setUser } = useApp();
  const [quests, setQuests] = useState([]);
  const [attributes, setAttributes] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState("ACTIVE"); // ACTIVE | COMPLETED | ALL

  // Quick To-Do input state
  const [todoTitle, setTodoTitle] = useState("");
  const [todoCategory, setTodoCategory] = useState("Work");
  const [todoDifficulty, setTodoDifficulty] = useState("EASY");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [questData, charData, achData] = await Promise.all([
        api.fetchQuests().catch(() => []),
        api.fetchCharacter().catch(() => ({ attributes: {} })),
        api.fetchAchievements().catch(() => ({ achievements: [] })),
      ]);
      setQuests(questData || []);
      setAttributes(charData?.attributes || null);
      setAchievements((achData?.achievements || []).filter((a) => a.unlocked).slice(0, 3));
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleComplete = async (id) => {
    try {
      const result = await api.completeQuest(id);
      if (result?.user) setUser(result.user);
      await load();
    } catch (err) {
      console.error("Failed to complete task", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteQuest(id);
      await load();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!todoTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Map category to standard attribute
      const attrMap = {
        Work: "Discipline",
        Learning: "Intelligence",
        Health: "Strength",
        Creative: "Creativity",
        Wellness: "Vitality",
      };
      await api.createQuest({
        title: todoTitle.trim(),
        category: todoCategory,
        difficulty: todoDifficulty,
        attribute: attrMap[todoCategory] || "Discipline",
        dueLabel: "Today",
      });
      setTodoTitle("");
      await load();
    } catch (err) {
      console.error("Failed to add task", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeQuests = quests.filter((q) => q.status === "ACTIVE");
  const completedQuests = quests.filter((q) => q.status === "COMPLETED");

  const filteredQuests = quests.filter((q) => {
    if (filterTab === "ACTIVE") return q.status === "ACTIVE";
    if (filterTab === "COMPLETED") return q.status === "COMPLETED";
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-400">
        <Sparkles className="animate-spin mr-2 text-arcane-400" size={20} /> Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Profile Summary */}
      {user && (
        <div className="panel p-6 flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-arcane-500 to-blue-500 flex items-center justify-center text-3xl shadow-glow">
              {user.avatar || "🧙"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-white">{user.displayName}</h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-arcane-600/20 text-arcane-400 border border-arcane-600/30">
                  {user.title}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 w-64">
                <span className="text-xs text-slate-400 font-medium">LVL {user.level}</span>
                <div className="progress-track flex-1">
                  <div
                    className="progress-fill bg-gradient-to-r from-arcane-500 to-blue-400"
                    style={{ width: `${Math.min(100, (user.xp / user.xpToNext) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500">{user.xp} / {user.xpToNext}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <StatPill icon={<Coins size={16} />} value={user.gold?.toLocaleString() || "0"} label="Gold" color="text-amber-400" />
            <StatPill icon={<Flame size={16} />} value={user.streak || 0} label="Streak" color="text-orange-400" />
            <StatPill icon={<CheckSquare size={16} />} value={`${activeQuests.length}`} label="Active Tasks" color="text-emerald-400" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main To-Do List & Quick Add */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Add To-Do Box */}
          <div className="panel p-6 border-arcane-600/30">
            <h2 className="font-display text-base text-white flex items-center gap-2 mb-3">
              <Plus size={18} className="text-arcane-400" /> Quick Add To-Do Item
            </h2>
            <form onSubmit={handleAddTodo} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="What do you need to do today? (e.g. Finish report, 30 min workout)..."
                  value={todoTitle}
                  onChange={(e) => setTodoTitle(e.target.value)}
                  className="flex-1 bg-ink-800 border border-ink-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-arcane-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!todoTitle.trim() || isSubmitting}
                  className="bg-arcane-600 hover:bg-arcane-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0"
                >
                  <Plus size={16} /> Add Task
                </button>
              </div>
              <div className="flex items-center gap-3 flex-wrap text-xs text-slate-400">
                <span className="text-slate-500">Options:</span>
                <div className="flex items-center gap-1.5">
                  <span>Category:</span>
                  <select
                    value={todoCategory}
                    onChange={(e) => setTodoCategory(e.target.value)}
                    className="bg-ink-800 border border-ink-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Difficulty:</span>
                  <select
                    value={todoDifficulty}
                    onChange={(e) => setTodoDifficulty(e.target.value)}
                    className="bg-ink-800 border border-ink-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Interactive To-Do List */}
          <div className="panel p-6">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
              <div>
                <h2 className="font-display text-lg text-white flex items-center gap-2">
                  📝 Daily To-Do List & Quests
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {completedQuests.length} of {quests.length} tasks completed today
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-ink-800 p-1 rounded-xl border border-ink-700">
                {["ACTIVE", "COMPLETED", "ALL"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      filterTab === tab
                        ? "bg-arcane-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab === "ACTIVE" ? `Active (${activeQuests.length})` : tab === "COMPLETED" ? `Completed (${completedQuests.length})` : `All (${quests.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            {quests.length > 0 && (
              <div className="mb-5 bg-ink-800 p-3 rounded-xl border border-ink-700">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">Daily Progress</span>
                  <span className="text-arcane-400 font-semibold">
                    {Math.round((completedQuests.length / quests.length) * 100)}%
                  </span>
                </div>
                <div className="progress-track h-2">
                  <div
                    className="progress-fill bg-gradient-to-r from-emerald-500 to-arcane-500"
                    style={{ width: `${(completedQuests.length / quests.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* List of Tasks */}
            <div className="space-y-3">
              {filteredQuests.map((q) => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
              ))}
              {filteredQuests.length === 0 && (
                <div className="text-center py-10 border border-dashed border-ink-700 rounded-xl">
                  <p className="text-sm text-slate-400">
                    {filterTab === "ACTIVE"
                      ? "🎉 All active tasks done! Add a new task above."
                      : filterTab === "COMPLETED"
                      ? "No completed tasks yet. Check off tasks as you finish them!"
                      : "No tasks found. Create one above to get started!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Widgets: Attributes & Recent Achievements */}
        <div className="space-y-6">
          {/* Attributes */}
          <div className="panel p-6">
            <h2 className="font-display text-lg text-white flex items-center gap-2 mb-4">
              <Zap size={17} className="text-amber-400" /> Stats & Attributes
            </h2>
            {attributes && Object.keys(attributes).length > 0 ? (
              Object.entries(attributes).map(([key, value]) => (
                <AttributeBar key={key} name={key} value={value} compact />
              ))
            ) : (
              <p className="text-xs text-slate-500">Complete tasks to increase your stats.</p>
            )}
          </div>

          {/* Recent Achievements */}
          <div className="panel p-6">
            <h2 className="font-display text-lg text-white flex items-center gap-2 mb-4">
              <Trophy size={17} className="text-amber-400" /> Achievements
            </h2>
            <div className="space-y-3">
              {achievements.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center text-lg shrink-0">
                    {a.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{a.title}</p>
                    <p className="text-xs text-emerald-400">Unlocked</p>
                  </div>
                </div>
              ))}
              {achievements.length === 0 && (
                <p className="text-xs text-slate-500">Complete daily tasks to unlock achievements!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
