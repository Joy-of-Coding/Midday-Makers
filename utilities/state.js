/*
UTILITY: State (single source of truth)

Goal
- Read and write the entire app state to localStorage safely.

What belongs here
- load/save functions
- small helpers like State.get(), State.set(), State.todayKey()
- (Students may add more helpers via tickets)
*/

(function () {
  const KEY = 'microStacker_v1';

  const defaults = {
    goalCategories: {},   // { [catId]: { stackProgress, activeHabits:[], unlockedHabits:[] } }
    selectedCategory: null,
    history: {},          // { 'YYYY-MM-DD': { [habitId]: true } }
    streaks: {},          // { [habitId]: number }
    xp: 0,
    badges: {},           // { [badgeId]: true }
    timers: {},           // { [habitId]: { durationSec, remainingSec, running, lastStart } }
    reminders: []         // [{ id, scope:'global'|'habit', habitId?, type:'DAILY'|'WEEKLY', daysOfWeek?, times:[] }]
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { ...defaults };
    } catch {
      return { ...defaults };
    }
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function get() { return load(); }
  function set(next) { save(next); }

  // Local YYYY-MM-DD (avoids timezone rollover surprises)
  function todayKey() {
    const now = new Date();
    const tz = now.getTimezoneOffset() * 60000;
    const local = new Date(now - tz);
    return local.toISOString().slice(0, 10);
  }

  // Expose a tiny, safe API
  window.State = { get, set, todayKey };
})();
