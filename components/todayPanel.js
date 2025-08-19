/*
COMPONENT: Today Panel  — renders into #todayPanel

Goal
- Show today's active habits as checkboxes or buttons.
- Let the user mark a habit done/not done for today.

What to build
- A list of today's habits with a control to mark "done".
- Display the current streak next to each habit (optional).

Steps
1) const el = document.getElementById('todayPanel')
2) Render each active habit with a checkbox/button.
3) On toggle: State.toggleToday(...) (or similar), then refresh streaks/xp using utilities.

Avoid
- Writing to localStorage directly; always use /utilities/state.js.
*/
