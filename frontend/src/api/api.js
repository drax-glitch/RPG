import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("life_rpg_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export const login = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const register = (payload) => api.post("/auth/register", payload).then((r) => r.data);
export const fetchMe = () => api.get("/auth/me").then((r) => r.data);

// ---- Quests ----
export const fetchQuests = (params) => api.get("/quests", { params }).then((r) => r.data);
export const createQuest = (payload) => api.post("/quests", payload).then((r) => r.data);
export const completeQuest = (id) => api.patch(`/quests/${id}/complete`).then((r) => r.data);
export const deleteQuest = (id) => api.delete(`/quests/${id}`).then((r) => r.data);

// ---- Character ----
export const fetchCharacter = () => api.get("/character").then((r) => r.data);

// ---- Achievements ----
export const fetchAchievements = () => api.get("/achievements").then((r) => r.data);

// ---- Shop ----
export const fetchShopItems = (params) => api.get("/shop", { params }).then((r) => r.data);
export const buyItem = (id) => api.post(`/shop/${id}/buy`).then((r) => r.data);

// ---- Progress ----
export const fetchProgress = () => api.get("/progress").then((r) => r.data);

// ---- Settings ----
export const updateSettings = (payload) => api.patch("/settings", payload).then((r) => r.data);
export const resetStreak = () => api.post("/settings/reset-streak").then((r) => r.data);
export const resetCharacter = () => api.post("/settings/reset-character").then((r) => r.data);

export default api;
