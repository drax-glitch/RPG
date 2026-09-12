import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Quests from "./pages/Quests.jsx";
import Achievements from "./pages/Achievements.jsx";
import Shop from "./pages/Shop.jsx";
import Progress from "./pages/Progress.jsx";
import Settings from "./pages/Settings.jsx";
import Login from "./pages/Login.jsx";
import { useApp } from "./context/AppContext.jsx";

function ProtectedLayout({ children }) {
  const { token, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading your adventure…
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 max-w-[1400px]">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/quests" element={<ProtectedLayout><Quests /></ProtectedLayout>} />
      <Route path="/achievements" element={<ProtectedLayout><Achievements /></ProtectedLayout>} />
      <Route path="/shop" element={<ProtectedLayout><Shop /></ProtectedLayout>} />
      <Route path="/progress" element={<ProtectedLayout><Progress /></ProtectedLayout>} />
      <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
