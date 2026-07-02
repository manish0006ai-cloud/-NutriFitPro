const isBrowser = typeof window !== 'undefined';

export const storage = {
  get(key) {
    if (!isBrowser) return null;
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  set(key, value) {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  }
};

export function getUserProfile() { return storage.get('nutrifit_user'); }
export function saveUserProfile(p) {
  storage.set('nutrifit_user', p);
  fetch('/api/sync', { method: 'POST', body: JSON.stringify({ type: 'profile', data: p }), headers: { 'Content-Type': 'application/json' } }).catch(() => {});
}

export function getTodayKey() { return new Date().toISOString().split('T')[0]; }

export function getDayLog(date) {
  const key = date || getTodayKey();
  return storage.get(`nutrifit_log_${key}`) || {
    date: key, meals: { breakfast:[], lunch:[], dinner:[], pre_workout:[], post_workout:[], snacks:[] },
    totals: { calories:0, protein:0, carbs:0, fat:0, fiber:0 }, water: 0, supplements: []
  };
}

export function saveDayLog(log) {
  storage.set(`nutrifit_log_${log.date}`, log);
  fetch('/api/sync', { method: 'POST', body: JSON.stringify({ type: 'log', data: log }), headers: { 'Content-Type': 'application/json' } }).catch(() => {});
}

export function getWeightLogs() { return storage.get('nutrifit_weights') || []; }
export function saveWeightLog(entry) {
  const logs = getWeightLogs();
  const idx = logs.findIndex(l => l.date === entry.date);
  if (idx >= 0) logs[idx] = entry; else logs.push(entry);
  storage.set('nutrifit_weights', logs);
}

export function getStreak() {
  let streak = 0; let d = new Date();
  while (true) {
    const key = d.toISOString().split('T')[0];
    const log = storage.get(`nutrifit_log_${key}`);
    const hasMeals = log && Object.values(log.meals).some(m => m.length > 0);
    if (!hasMeals && streak > 0) break;
    if (hasMeals) streak++;
    d.setDate(d.getDate() - 1);
    if (streak === 0 && !hasMeals) break;
  }
  return streak;
}

export function getRecentDates(n = 7) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}
