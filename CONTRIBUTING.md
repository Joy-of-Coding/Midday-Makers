# Contributing Guide

Welcome! 🎉 All work runs through **GitHub Projects tickets**. Each ticket = one branch = one PR.

---

## 🚫 Do NOT Edit (setup files)
Only mentors/leads touch these:
- `.github/workflows/ci.yml`
- `.editorconfig`, `.prettierrc`
- `index.html` (entry only)
- `vercel.json`, `LICENSE`, `CONTRIBUTING.md`, `README.md`

---

## ✅ Where You SHOULD Work
All feature work goes in these folders/files:
- `components/` → UI features (pickers, badges, reminders, tower, etc.)
- `utilities/` → shared logic (state, streaks, timers, scheduler, xp, notifications, ics)
- `data/` → seed JSON for categories & habits
- `styles.css` → shared styles
- `app.js` → app bootstrap (wire components together). Add imports/initialization here **only** if your ticket needs it

---

## 🧭 Ticket → Branch → PR Workflow

1) **Pick/assign a ticket** in the Project board  
2) **Create a branch by clicking in the ticket or**  
   ```bash
   git checkout main && git pull
   git checkout -b ticket-<number>-<short-name>
   # e.g. ticket-23-habit-picker
