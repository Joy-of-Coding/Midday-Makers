# Manual Test Instructions — Habit Picker Component

## Purpose
Ensure the habitPicker component renders correctly, allows selection/deselection of habits, persists selections after refresh, and is accessible to all users.

## Prerequisites
- Local server is running the app (`python3 -m http.server 8000` or similar).
- `categories.json` exists and habits are loading.
- No unresolved dependency tickets.

---

## Steps

1. **Open the App**
   - Start your local server.
   - Navigate to the page containing the habitPicker (`http://localhost:8000`).
   - ✅ Verify a list of habit chips is visible and populated from the categories JSON.

2. **Toggle Habit Selection (Mouse)**
   - Click a habit chip.
   - ✅ Chip visually toggles to "selected" state.
   - Click the same chip again.
   - ✅ Chip toggles back to "unselected" state.

3. **Select Multiple Habits**
   - Click two or more different chips.
   - ✅ Each chip toggles independently; multiple chips can be selected at once.

4. **Persistence After Refresh**
   - Select a few chips.
   - Refresh the page.
   - ✅ Previously selected chips remain selected (values stored in localStorage).

5. **Keyboard Accessibility**
   - Use `Tab` to focus on a chip.
   - Press `Enter` or `Space` to toggle selection.
   - ✅ Chip toggles selection just like with a mouse.
   - Use arrow keys (if supported) to move between chips.
   - ✅ Multiple chips can be selected using only the keyboard.
   - ✅ Visible focus indicator is present.

6. **Console Errors**
   - Open DevTools → Console.
   - Interact with the habitPicker (select/deselect, refresh, use keyboard).
   - ✅ No errors or warnings appear in the console.

---

## Pass Criteria
- Chips toggle on click and keyboard.
- Multiple chips can be selected/deselected.
- Selection persists after refresh (localStorage).
- Component is fully keyboard accessible with visible focus.
- No console errors or warnings.