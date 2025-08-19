/*
UTILITY: Scheduler (in-tab reminders)

Goal
- This file will handle scheduling reminders while the page is open.
- Eventually it should call Notify.notify(...) at certain times.

What to put here
- Functions like `scheduleDaily(timeHHMM)` and `clearAll()`

How to work on this file
1) Create functions to schedule and clear reminders using setTimeout/setInterval.
2) Use Notify.notify(title, message) when a reminder fires.
3) Keep this focused ONLY on scheduling — do not write UI code here.
*/

// Safe placeholder (does nothing yet, so the app won’t break)
window.Scheduler = {
  scheduleDaily: function (_timeHHMM) {
    console.log("Scheduler.scheduleDaily called (not yet implemented)");
  },
  clearAll: function () {
    console.log("Scheduler.clearAll called (not yet implemented)");
  }
};
