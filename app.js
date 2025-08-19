/*
APP ENTRY (start here)

What this file does
- Runs when the page loads.
- Sets up the app (theme button, loading data, calling component functions).

What to put here
- A small "init()" function that calls each component’s setup (e.g., HabitPicker, TodayPanel).
- High-level event wiring (like theme toggle).

How to work on this file
1) If your ticket adds a new component, call its setup/mount function from init().
2) Keep this file small. Put feature logic in /components or /utilities.
3) Don’t write to localStorage directly—use helpers in /utilities/state.js.
*/

(function () {
  function applySavedTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.setAttribute('aria-pressed', saved === 'light' ? 'true' : 'false');
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
  }

  function init() {
    applySavedTheme();
    const t = document.getElementById('themeToggle');
    if (t) t.onclick = toggleTheme;

    // Boot the UI (safe even if components are still stubs)
    if (window.HabitPicker?.mount) window.HabitPicker.mount();
    if (window.TodayPanel?.mount) window.TodayPanel.mount();
    if (window.TowerView?.mount) window.TowerView.mount();
    if (window.Badges?.mount) window.Badges.mount();
    if (window.Reminders?.mount) window.Reminders.mount();
  }

  window.addEventListener('DOMContentLoaded', init);
})();
