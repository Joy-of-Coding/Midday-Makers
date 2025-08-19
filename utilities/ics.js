/*
UTILITY: Calendar (.ics / Google link)

Goal
- Let users add reminders to their calendar (works even when the app is closed).

What belongs here
- ICS.downloadIcs({ title, startLocal, durationMin, recur })
- ICS.googleQuickAddUrl({ title, startLocal, durationMin })

Rules
- No DOM changes or state writes—just build files/links.
*/
