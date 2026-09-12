import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swords } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function Login() {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ username: "", email: "", password: "", displayName: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { loginUser, registerUser } = useApp();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await loginUser({ username: form.username, password: form.password });
      } else {
        await registerUser(form);
      }
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-arcane-500 to-arcane-600 flex items-center justify-center shadow-glow mb-3">
            <Swords size={22} className="text-white" />
          </div>
          <h1 className="font-display text-2xl text-white">Life RPG</h1>
          <p className="text-sm text-slate-500 mt-1">Turn your habits into an adventure</p>
        </div>

        <form onSubmit={submit} className="panel p-6 space-y-4">
          {mode === "register" && (
            <input
              placeholder="Display name"
              value={form.displayName}
              onChange={update("displayName")}
              className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-arcane-500"
            />
          )}
          <input
            placeholder="Username"
            value={form.username}
            onChange={update("username")}
            required
            className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-arcane-500"
          />
          {mode === "register" && (
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={update("email")}
              required
              className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-arcane-500"
            />
          )}
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={update("password")}
            required
            className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-arcane-500"
          />

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-arcane-600 hover:bg-arcane-500 transition-colors text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "login" ? "Enter the realm" : "Create character"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          {mode === "login" ? "New adventurer?" : "Already have a character?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-arcane-400 hover:text-arcane-300"
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
