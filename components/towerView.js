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
