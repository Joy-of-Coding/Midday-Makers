/*
COMPONENT: Tower View  — renders into #towerView

Goal
- Visual "stack" showing recent completions (e.g., blocks for the last 7 days).

What to build
- Small colored blocks/rows based on State.history.
- Use category colors or simple colors to make the stack fun.

Steps
1) const el = document.getElementById('towerView')
2) Read State.history (dates → which habits done).
3) Draw blocks for each day/habit done.
4) Re-render when today’s data changes.

Avoid
- Fetching or saving data here; just read from State and render.
*/

// Get last 7 UTC date keys (YYYY-MM-DD)
function getLast7Days() {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - i
    ));
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

// Map each date to boolean (filled if any habit done)
function mapDaysToCompletion(history) {
  const last7 = getLast7Days();
  return last7.map(date =>
    history[date] && Object.values(history[date]).some(Boolean)
  );
}

// Render colored squares for each day (now using CSS Grid)
function renderTowerView(history) {
  const completions = mapDaysToCompletion(history);
  const el = document.getElementById('towerView');
  
  el.innerHTML = `
    <div class="tower-grid">
      ${completions.map(done => 
        `<div class="tower-day ${done ? 'completed' : 'not-completed'}"></div>`
      ).join('')}
    </div>
    <div class="legend">
      <span class="legend-item">
        <span class="legend-swatch completed"></span>
        Done
      </span>
      <span class="legend-item">
        <span class="legend-swatch not-completed"></span>
        Not Done
      </span>
    </div>
  `;
}

function renderTowerView(history) {
  const completions = mapDaysToCompletion(history);
  const el = document.getElementById('towerView');
  el.innerHTML = `
    <div style="display:flex;justify-content:center;align-items:center;">
      ${completions.map(done =>
        `<span style="display:inline-block;width:40px;height:40px;margin:4px;
          background:${done ? '#00B300' : '#005580'};border-radius:8px;"></span>`
      ).join('')}
    </div>
    <div style="margin-top:8px;display:flex;justify-content:center;gap:16px;font-size:14px;">
      <span>
        <span style="display:inline-block;width:16px;height:16px;background:#00B300;border-radius:4px;margin-right:4px;"></span>
        Done
      </span>
      <span>
        <span style="display:inline-block;width:16px;height:16px;background:#005580;border-radius:4px;margin-right:4px;"></span>
        Not Done
      </span>
    </div>
  `;
}
// TEMP TESTING — remove before submitting!
const testHistory = {
  "2025-08-14": { habitA: true },
  "2025-08-15": { habitA: false, habitB: true },
  "2025-08-16": { habitA: false },
  "2025-08-17": { habitB: false },
  "2025-08-18": { habitA: true },
  "2025-08-19": { habitA: false, habitB: false },
  "2025-08-20": { habitA: true }
};

renderTowerView(testHistory);
// Example usage (call this whenever State.history changes):
// renderTowerView(State.history);
