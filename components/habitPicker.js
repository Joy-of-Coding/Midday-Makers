/*
COMPONENT: Habit Picker  — renders into #habitPicker

Goal
- Show a list of habits the user can choose to work on.
- (Later) May also show recommended next habits by category.

What to build
- Render clickable "chips" or buttons for habits.
- When the user picks one, update state via State.* and refresh the UI.

Steps
1) Find the container: const el = document.getElementById('habitPicker')
2) Build the list of habits (from /data or State).
3) On click: update State (do not use localStorage directly), then re-render what changed.

Avoid
- Editing HTML outside this section.
- Storing data anywhere except through /utilities/state.js.
*/
