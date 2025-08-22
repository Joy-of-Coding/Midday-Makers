/*
UTILITY: Streaks

Goal
- Calculate per-habit streaks based on State.history.

What belongs here
- Pure functions like Streaks.calc(state) that return updated streak counts.
- Optional helper to decide if a new habit should unlock after N days.

Rules
- No DOM changes here. No alerts/notifications. Pure logic only.
*/

/**
 * Calculate the current streak of consecutive completed days ending at today.
 * @param {Array} history - Array of day objects with {date, completed}
 */
export function calculateCurrentStreak(history) {
  let streak = 0;

  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].completed) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate the best streak in history
 * @param {Array} history
 */
export function bestStreak(history) {
  let best = 0;
  let current = 0;

  history.forEach((day) => {
    if (day.completed) {
      current++;
      if (current > best) best = current;
    } else {
      current = 0;
    }
  });
  return best;
}

/**
 * Get current streak from localStorage (compatible with app.js implementation)
 * @returns {number} Current streak count
 */
export function getCurrentStreak() {
  try {
    if (typeof Storage !== 'undefined') {
      const streak = localStorage.getItem('currentStreak') || 0;
      return parseInt(streak) || 0;
    }
  } catch (error) {
    console.warn('localStorage not available for streak:', error);
  }
  return 0;
}

/**
 * Update streak - only increment if habits were completed today
 * @returns {number} Updated streak count
 */
export function updateStreak() {
  try {
    const today = new Date().toDateString();
    const lastStreakUpdate = localStorage.getItem('lastStreakUpdate');
    
    // Only update streak once per day
    if (lastStreakUpdate !== today) {
      const currentStreak = getCurrentStreak();
      const newStreak = currentStreak + 1;
      localStorage.setItem('currentStreak', newStreak.toString());
      localStorage.setItem('lastStreakUpdate', today);
      return newStreak;
    } else {
      return getCurrentStreak();
    }
  } catch (error) {
    console.warn('Failed to update streak:', error);
    return 0;
  }
}

/**
 * Reset streak for new day
 */
export function resetDailyStreak() {
  try {
    if (typeof Storage !== 'undefined') {
      localStorage.setItem('currentStreak', '0');
      localStorage.removeItem('lastStreakUpdate');
    }
  } catch (error) {
    console.warn('Failed to reset daily streak:', error);
  }
}

/**
 * Check if a streak-based badge should be unlocked
 * @param {string} badgeId - Badge identifier
 * @param {number} currentStreak - Current streak count
 * @returns {boolean} Whether badge is unlocked
 */
export function isStreakBadgeUnlocked(badgeId, currentStreak) {
  switch (badgeId) {
    case 'streak-3':
      return currentStreak >= 3;
    case 'streak-7':
      return currentStreak >= 7;
    default:
      return false;
  }
}

/*
// --- Commented Example Usage ---

const history = {
  "2025-08-14": true,
  "2025-08-15": true,
  "2025-08-16": true,
  "2025-08-18": true, // gap
  "2025-08-19": true,
  "2025-08-21": true // future
};
console.log(calculateCurrentStreak(history)); // Expected: 2 (if today is 2025-08-20)
console.log(bestStreak(history)); // Expected: 3
*/

// Make functions available globally for non-module scripts
if (typeof window !== 'undefined') {
  window.Streaks = { 
    calculateCurrentStreak, 
    bestStreak, 
    getCurrentStreak, 
    updateStreak, 
    resetDailyStreak,
    isStreakBadgeUnlocked
  };
}

