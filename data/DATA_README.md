# Data Guide for Midday-Makers

This folder (`/data`) stores the **lists and starting information** the app needs. You will NOT write JavaScript code here - only edit or add data in JSON format.

---

## Files in this folder

### `categories.json`
- Holds the **categories** of habits (like Health, Learning, Fitness, Social)
- Each category has:
  - an `id` (a unique number or short name),
  - a `name` (what shows on the screen),
  - and maybe an `icon` (optional)

# Data Guide for Midday-Makers

This folder (`/data`) stores the **lists and starting information** the app needs.  
You will NOT write JavaScript code here — only edit or add data in JSON format.

---

## Files in this folder

### `categories.json`
- Holds the **categories** of habits (like Health, Learning, Fitness, Social).
- Each category has:
  - an `id` (a unique number or short name),
  - a `name` (what shows on the screen),
  - and maybe an `icon` (optional).


👉 Example entry:

```json
{
  "id": "health",
  "name": "Health",
  "icon": "💪"
}
```


#### `habits.json`
- Holds the **list of habits** that users can pick from
- Each habit has: 
  - an `id` (unique name or number)
  - a categoryID (which category it belongs to),
  - a `name` (the habit itself),
  - and maybe a short `description`


👉 Example entry:

```json
{
  "id": "drink-water",
  "categoryId": "health",
  "name": "Drink a Glass of Water",
  "description": "Stay hydrated and energized!"
}
``` 

##### **Rules for Editing Data**

- Do not delete existing entries unless your ticket says to.

- Always keep JSON valid:

- Strings go inside quotes " ".

- Commas go between items, but not after the last one.

- Use { } for objects and [ ] for lists.

- Test after changes: Run the app locally to confirm it still loads without errors.

- Work only on your assigned ticket: Don’t make changes in here unless it’s part of your task.


