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

/**
 * Generates and triggers download of a .ics calendar file for today's habits.
 * @param {Object} opts - Options for the calendar event
 * @param {string} opts.title - Event title (e.g. "Habit Tracker - YYYY-MM-DD")
 * @param {string[]} opts.habits - Array of habit names
 * @param {Date} opts.date - JS Date object for today
 */
export function downloadTodayHabitsIcs({ title, habits, date }) {
  // Check if any habits are selected before generating the file
  if (!habits || habits.length === 0) {
    alert('No Habits Selected');
    return; // Exit early if no habits
  }

  // Helper to pad month/day with leading zero (e.g. 8 -> "08")
  const pad = n => String(n).padStart(2, '0');

  // Get year, month, day for today and format as YYYYMMDD
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const dt = `${yyyy}${mm}${dd}`;

  // Calculate next day for DTEND (Google Calendar requires DTEND to be the day after for all-day events)
  // This ensures the event shows up as an all-day event for one day only
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  const ndY = nextDay.getFullYear();
  const ndM = pad(nextDay.getMonth() + 1);
  const ndD = pad(nextDay.getDate());
  const dtEnd = `${ndY}${ndM}${ndD}`;

  // All-day event start date
  const dtStart = `${dt}`;

  // Build description: single line with literal \n characters for newlines
  // Remove any extra line breaks from description and filter out empty/whitespace habits
  let description;
  if (habits.length) {
    const habitLines = habits.filter(h => h && h.trim()).map(h => `- ${h}`);
    // Use literal \n for line breaks so calendar apps parse multi-line descriptions correctly
    description = 'Habits:' + (habitLines.length ? '\\n' + habitLines.join('\\n') : '');
  } else {
    description = 'No habits selected.';
  }

  // Build .ics file content using string concatenation
  // Each line follows the iCalendar (.ics) format
  // Use \r\n for line endings for maximum compatibility with calendar apps
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:Habit Tracker', // Identifies the app that created the event
    'BEGIN:VEVENT',
    `UID:habit-tracker-${dt}@joyofcoding`, // Unique event identifier
    `DTSTAMP:${dt}T000000Z`, // Timestamp for when the event was created
    `DTSTART;VALUE=DATE:${dtStart}`, // Event start (all-day)
    `DTEND;VALUE=DATE:${dtEnd}`,     // Event end (next day for all-day event)
    `SUMMARY:${title}`,              // Event title
    `DESCRIPTION:${description}`,    // Event description (habits list, single line with \n)
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  // Create a Blob from the .ics string and generate a download URL
  // This allows the file to be downloaded without a server or backend
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);

  // Filename format: habits-YYYY-MM-DD.ics for easy identification
  const filename = `habits-${yyyy}-${mm}-${dd}.ics`;

  // Create a temporary anchor element to trigger the download
  // This works in all browsers, including Firefox
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);

  // Programmatically click the anchor to start download
  // This triggers the browser's download dialog
  a.click();

  // Clean up: remove anchor and revoke the object URL
  // Prevents memory leaks and keeps the DOM clean
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}