import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  ScrollText,
  User,
  Trophy,
  Store,
  BarChart3,
  Settings,
  Swords,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/quests", label: "Quests", icon: ScrollText },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/shop", label: "Shop", icon: Store },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { user } = useApp();

  return (
    <aside className="w-64 shrink-0 bg-ink-900 border-r border-ink-700 flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-arcane-500 to-arcane-600 flex items-center justify-center shadow-glow">
          <Swords size={18} className="text-white" />
        </div>
        <span className="font-display text-lg tracking-wide text-white">Life RPG</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-arcane-600/20 text-arcane-400 border border-arcane-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-ink-800"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-800 border border-ink-700">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-arcane-500 to-blue-500 flex items-center justify-center text-lg">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-200 truncate">{user.displayName?.split(" ")[0]}</p>
              <div className="progress-track mt-1">
                <div
                  className="progress-fill bg-gradient-to-r from-arcane-500 to-blue-400"
                  style={{ width: `${Math.min(100, (user.xp / user.xpToNext) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
