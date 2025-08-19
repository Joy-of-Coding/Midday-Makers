/*
COMPONENT: Reminders  — renders into #reminders

Goal
- Let the user set a daily/weekly reminder time (in‑tab notification),
  and provide "Add to Calendar" buttons (.ics / Google link).

What to build
- A time input and save button.
- Buttons for "Download .ics" and "Add to Google Calendar".

Steps
1) const el = document.getElementById('reminders')
2) On save: store settings via State (e.g., State.setReminder(...))
3) Use Scheduler to schedule notifications while the tab is open.
4) Use ICS helpers to create calendar files/links.

Avoid
- Complex scheduling inside this component. Put scheduling in /utilities/scheduler.js.
*/
