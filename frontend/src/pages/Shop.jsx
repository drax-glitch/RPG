import React, { useEffect, useState, useCallback } from "react";
import { Coins } from "lucide-react";
import * as api from "../api/api";
import { useApp } from "../context/AppContext.jsx";

const CATEGORIES = ["All", "Avatars", "Frames", "Themes", "Badges", "Companions", "Effects", "Weapons", "Magic"];

export default function Shop() {
  const { user, setUser } = useApp();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("All");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    const data = await api.fetchShopItems({ category });
    setItems(data);
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  const handleBuy = async (item) => {
    setBusyId(item.id);
    try {
      const result = await api.buyItem(item.id);
      setUser({ ...user, gold: result.goldRemaining });
      await load();
    } catch (err) {
      alert(err?.response?.data?.error || "Purchase failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-white flex items-center gap-2">🏪 The Arcane Shop</h1>
          <p className="text-sm text-slate-500 mt-1">Spend your gold on exclusive cosmetics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
          <Coins size={16} /> {user.gold.toLocaleString()} Gold
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              category === c
                ? "bg-arcane-600/20 text-arcane-400 border-arcane-600/40"
                : "bg-ink-800 text-slate-400 border-ink-700 hover:text-slate-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {items.map((item) => (
          <div key={item.id} className="panel overflow-hidden flex flex-col">
            <div className="h-28 flex items-center justify-center text-5xl bg-ink-800/60">
              {item.icon}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <p className="text-sm font-medium text-slate-100">{item.name}</p>
              <p className="text-xs text-slate-500 mt-1 flex-1">{item.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-amber-400 text-sm font-semibold flex items-center gap-1">
                  <Coins size={13} /> {item.price.toLocaleString()}
                </span>
                <button
                  disabled={item.owned || busyId === item.id || user.gold < item.price}
                  onClick={() => handleBuy(item)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    item.owned
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-arcane-600 hover:bg-arcane-500 text-white disabled:opacity-40"
                  }`}
                >
                  {item.owned ? "✓ Owned" : "Buy"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
