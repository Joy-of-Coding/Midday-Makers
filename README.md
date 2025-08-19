# Midday-Makers — Micro-Habit Stacker 

A simple **micro-habit tracker** for Challenge Week.  
Runs entirely in the browser (no backend). Data is stored in `localStorage`.  
Final deploy will be on **Vercel (teacher-led on Friday).**

---

## 🚀 What It Does
- Pick a **category** and choose micro-habits.
- Daily checklist to **mark habits done/not done.**
- **Streaks + XP** to reward consistency.
- **Tower view** for last 7 days.
- **Badges** for milestones.
- Optional in-tab **reminders** and `.ics` export to calendar.

---

## 🛠 Tech Stack
- **HTML / CSS / JavaScript** (vanilla, no build step)
- **localStorage** for data
- Assets in `public/assets`
- **Deployment** → Vercel (teacher will guide)

---

## 📂 Project Structure

**Where you work:**
- `components/` → UI features  
- `utilities/` → helper logic  
- `data/` → JSON + docs  
- `app.js` → main app logic  
- `styles.css` → global styles  

**Please don’t edit (setup only):**
- `index.html`  
- `.editorconfig`, `.prettierrc`, `.gitignore`  
- `vercel.json`, `LICENSE`, `CONTRIBUTING.md`  
- `.github/` workflows  

---

## 🖥 Run Locally

### Simple Local Server
**macOS/Linux**
cd project-folder
python3 -m http.server 8000
Go to: http://localhost:8000


**Windows (Powershell)**
cd path\to\project
py -m http.server 8000
Go to: http://localhost:8000 

### 🧭 How We Work

- Pick a GitHub issue (ticket).

- Create a branch for that issue.

- Keep changes small and focused.



### 🌱 Branch / PR Flow
- git checkout main 
- git pull
- git checkout -b <YOUR-BRANCH-NAME> 
- git add .
- git commit -m "Commit Message"
- git push -u origin <YOUR-BRANCH-Name>

Then → Open PR → link the issue → move ticket to request review.

### ✅ Definition of Done

Runs locally at http://localhost:8000 with no console errors.

Keyboard accessible (tab through controls; visible focus).

Uses helpers in utilities/state.js (no direct localStorage inside components).

Looks OK at mobile width (375px) in DevTools.

PR links its ticket.

### 🧪 Quick AI Prompts (for Copilot) - If you’re stuck, here are some quick example prompts you can paste into AI tools for guidance

“Implement calculateCurrentStreak(days) in utilities/streaks.js. Explain edge cases.”

“Render habit chips from data/habits.json into #habit-picker. Explain steps.”

“Add :focus-visible outline for interactive elements in styles.css.”

“Create toast(message) in utilities/notify.js (2s auto-remove).”

### 🗂 Git Commands (Cheat Sheet)

- git clone <repo-url.git> → copies the online repository to your local machine

- git fetch origin → check for updates

- git status → see changes

- git pull → bring updates into local

- git checkout -b new-branch → start a new branch

- git add . → stage all changes

- git commit -m "message" → save staged changes

- git push -u origin branch-name → send branch online

- git branch → list local branches

### 🤝 Contributing

See CONTRIBUTING.md for full guidelines.
Work happens on branches + PRs linked to GitHub Project tickets.
---

## Contributors

- Ellery Dorroh (@ellery_d, @EDORROH, Github)
- Corey Knauer (@[ADD DISCORD NAME HERE] in discord, @[ADD GITHUB NAME HERE], Github)
- John Caldwell (@[ADD DISCORD NAME HERE] in discord, @[ADD GITHUB NAME HERE], Github)
- Melissa Usher (@MelissaU in discord, @MelEUsher in Github)
- Rebecca A. Stone (@beckstone on discord and Github)
- Abu H Kamal(@kamal3235, kamal3235 in Github)
- Christina Lerch (@Chris-60191, sunny0221 in github)

---

> "Future Focused: Tiny Tech for Your Future Self" by keeping it **Simple**, making it **Lovable**, and finishing it **Complete**.

