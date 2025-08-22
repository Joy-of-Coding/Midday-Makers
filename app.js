
// app.js
console.log('🚀 App.js loading...');

// XP tracking variables
let dailyXP = 0;
let totalXP = 0;

// Load XP from localStorage
function loadXP() {
  const savedDailyXP = localStorage.getItem('dailyXP');
  const savedTotalXP = localStorage.getItem('totalXP');
  
  if (savedDailyXP) dailyXP = parseInt(savedDailyXP);
  if (savedTotalXP) totalXP = parseInt(savedTotalXP);
  
  updateXPDisplay();
}

// Save XP to localStorage
function saveXP() {
  localStorage.setItem('dailyXP', dailyXP.toString());
  localStorage.setItem('totalXP', totalXP.toString());
}

// Update XP display
function updateXPDisplay() {
  const dailyXPElement = document.getElementById('xp');
  const totalXPElement = document.getElementById('total-xp');
  
  if (dailyXPElement) dailyXPElement.textContent = dailyXP;
  if (totalXPElement) totalXPElement.textContent = totalXP;
}

// Add XP (positive or negative)
function addXP(points) {
  dailyXP += points;
  totalXP += points;
  
  // Ensure XP doesn't go below 0
  if (dailyXP < 0) dailyXP = 0;
  if (totalXP < 0) totalXP = 0;
  
  saveXP();
  updateXPDisplay();
  
  // Show notification
  showNotification(points > 0 ? `+${points} XP earned!` : `${points} XP lost!`);
}

// Show notification
function showNotification(message) {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: '#4caf50',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: '1000',
    fontSize: '14px',
    fontWeight: '500',
    opacity: '0',
    transform: 'translateY(-10px)',
    transition: 'all 0.3s ease'
  });
  
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  });
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Check if it's a new day and reset daily XP
function checkNewDay() {
  const today = new Date().toDateString();
  const lastReset = localStorage.getItem('lastXPReset');
  
  if (lastReset !== today) {
    // Reset daily XP
    dailyXP = 0;
    localStorage.setItem('lastXPReset', today);
    updateXPDisplay();
    
    // Reset completed habits for the new day
    completedHabits.clear();
    saveCompletedHabits();
    
    // Reset daily streak (not total streak)
    resetDailyStreak();
    
    // Reset habit button visual states
    resetHabitButtonStates();
    
    // Update badges to reflect the reset
    renderBadges();
    
    // Show notification about daily reset
    showNotification('🔄 New day! All habits reset. Start fresh!');
    
    console.log('🔄 New day detected - Daily XP, habits, and streaks reset');
  }
}

// Reset all habit buttons to inactive state
function resetHabitButtonStates() {
  const habitButtons = document.querySelectorAll('.habit-btn');
  habitButtons.forEach(btn => {
    btn.classList.remove('active');
    btn.style.background = '';
    btn.style.color = '';
  });
  console.log('🔄 Reset habit button visual states');
}

// Badge system
let completedHabits = new Set();

// Load completed habits from localStorage
function loadCompletedHabits() {
  const saved = localStorage.getItem('completedHabits');
  if (saved) {
    completedHabits = new Set(JSON.parse(saved));
  }
}

// Save completed habits to localStorage
function saveCompletedHabits() {
  localStorage.setItem('completedHabits', JSON.stringify(Array.from(completedHabits)));
}

// Get current streak (simplified - you can enhance this)
function getCurrentStreak() {
  console.log('🔄 getCurrentStreak() called');
  const streak = localStorage.getItem('currentStreak') || 0;
  const result = parseInt(streak);
  console.log('📈 Current streak from localStorage:', streak, 'Parsed as:', result);
  return result;
}

// Check if habits were completed today
function hasCompletedHabitsToday() {
  return completedHabits.size > 0;
}

// Update streak - only increment if habits were completed today
function updateStreak() {
  console.log('🔄 updateStreak() called');
  const today = new Date().toDateString();
  const lastStreakUpdate = localStorage.getItem('lastStreakUpdate');
  
  console.log('📅 Today:', today, 'Last update:', lastStreakUpdate);
  
  // Only update streak once per day
  if (lastStreakUpdate !== today) {
    const currentStreak = getCurrentStreak();
    const newStreak = currentStreak + 1;
    localStorage.setItem('currentStreak', newStreak.toString());
    localStorage.setItem('lastStreakUpdate', today);
    console.log('📈 Streak updated to:', newStreak);
    return newStreak;
  } else {
    const currentStreak = getCurrentStreak();
    console.log('📈 Streak already updated today, current streak:', currentStreak);
    return currentStreak;
  }
}

// Reset streak for new day
function resetDailyStreak() {
  localStorage.setItem('currentStreak', '0');
  localStorage.removeItem('lastStreakUpdate'); // Allow streak to be updated again
  console.log('🔄 Daily streak reset to 0');
}

// Render badges section
function renderBadges() {
  const badgesSection = document.getElementById('badges');
  if (!badgesSection) return;
  
  const badges = [
    { id: 'first-habit', name: 'First Step', icon: '🎯', description: 'Complete your first habit' },
    { id: 'three-habits', name: 'Triple Threat', icon: '🔥', description: 'Complete 3 habits' },
    { id: 'all-habits', name: 'Habit Master', icon: '👑', description: 'Complete all 9 habits' },
    { id: 'streak-3', name: 'Consistent', icon: '📈', description: '3-day streak' },
    { id: 'streak-7', name: 'Week Warrior', icon: '🏆', description: '7-day streak' }
  ];
  
  badgesSection.innerHTML = `
    <h2>🏆 Achievement Badges</h2>
    <div class="badges-grid">
      ${badges.map(badge => {
        const isUnlocked = isBadgeUnlocked(badge.id);
        return `
          <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-label">${badge.name}</div>
            <div class="badge-description">${badge.description}</div>
            <div class="badge-status">${isUnlocked ? '✅ Unlocked' : '🔒 Locked'}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Check if a badge should be unlocked
function isBadgeUnlocked(badgeId) {
  console.log('🏆 isBadgeUnlocked() called with badgeId:', badgeId);
  const currentStreak = getCurrentStreak();
  const completedCount = completedHabits.size;
  
  console.log(`🏆 Checking badge ${badgeId}:`, {
    currentStreak,
    completedCount,
    totalHabits: 9
  });
  
  let result = false;
  switch (badgeId) {
    case 'first-habit':
      result = completedCount >= 1;
      break;
    case 'three-habits':
      result = completedCount >= 3;
      break;
    case 'all-habits':
      result = completedCount >= 9;
      break;
    case 'streak-3':
      result = currentStreak >= 3;
      break;
    case 'streak-7':
      result = currentStreak >= 7;
      break;
    default:
      result = false;
      break;
  }
  
  console.log(`🏆 Badge ${badgeId} result:`, result);
  return result;
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log('🎯 DOM Content Loaded');
  
  try {
    // Initialize XP system
    loadXP();
    checkNewDay();
    
    // Initialize badge system
    loadCompletedHabits();
    
    // Import the habit picker module
    const habitPickerModule = await import("./components/habitPicker.js");
    console.log('📦 Habit picker module loaded:', habitPickerModule);
    
    // Load and render habits
    console.log('📋 Loading categories...');
    fetch("./data/categories.json")
      .then(res => {
        console.log('📋 Categories fetch response:', res.status);
        return res.json();
      })
      .then(categories => {
        console.log('📋 Categories loaded:', categories);
        habitPickerModule.renderHabits(categories);
        console.log('📋 renderHabits called');
        
        // Set up habit click listeners after rendering
        setTimeout(() => {
          setupHabitListeners();
          renderBadges(); // Render badges after habits are set up
        }, 100);
      })
      .catch(err => {
        console.error("❌ Error loading categories:", err);
        showNotification('⚠️ Failed to load habits. Using fallback data.');
        // Use fallback categories if fetch fails
        const fallbackCategories = [
          {
            id: "health",
            name: "Health",
            icon: "🧘‍♂️",
            habits: [
              { id: "h1", name: "Drink 1 glass of water" },
              { id: "h2", name: "Take a 5-minute walk" },
              { id: "h3", name: "Take deep breaths" }
            ]
          },
          {
            id: "productivity",
            name: "Productivity",
            icon: "⏱️",
            habits: [
              { id: "h4", name: "Turn off notifications" },
              { id: "h5", name: "Create a quiet workspace" },
              { id: "h6", name: "Set specific work hours" }
            ]
          },
          {
            id: "learning",
            name: "Learning",
            icon: "📚",
            habits: [
              { id: "h7", name: "Find a mentor" },
              { id: "h8", name: "Practice for 15 minutes" },
              { id: "h9", name: "Read 1 chapter" }
            ]
          }
        ];
        habitPickerModule.renderHabits(fallbackCategories);
        
        // Set up habit click listeners after rendering
        setTimeout(() => {
          setupHabitListeners();
          renderBadges(); // Render badges after habits are set up
        }, 100);
      });

    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      console.log('🌓 Setting up theme toggle');
      themeToggle.addEventListener("click", () => {
        console.log('🌓 Theme toggle clicked');
        document.body.classList.toggle("dark");
        themeToggle.textContent = document.body.classList.contains("dark") ? "🌗" : "🌙";
      });
    }

    console.log('✅ App initialization complete');
    
  } catch (error) {
    console.error('❌ App initialization failed:', error);
  }
});

// Set up habit click listeners
function setupHabitListeners() {
  const habitButtons = document.querySelectorAll('.habit-btn');
  console.log('🎯 Setting up listeners for', habitButtons.length, 'habit buttons');
  
  habitButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const habitId = btn.dataset.habitId;
      const isActive = btn.classList.contains('active');
      
      console.log('🎯 Habit clicked:', habitId, 'Current state:', isActive ? 'active' : 'inactive');
      
      if (isActive) {
        // Deactivating habit - lose XP and remove from completed
        btn.classList.remove('active');
        btn.style.background = '';
        btn.style.color = '';
        addXP(-5); // Lose 5 XP
        completedHabits.delete(habitId);
        console.log('❌ Habit deactivated:', habitId);
      } else {
        // Activating habit - gain XP and add to completed
        btn.classList.add('active');
        btn.style.background = '#4caf50';
        btn.style.color = 'white';
        addXP(10); // Gain 10 XP
        completedHabits.add(habitId);
        console.log('✅ Habit activated:', habitId);
        
        // Update streak when completing a habit
        updateStreak();
      }
      
      // Save completed habits and update badges
      saveCompletedHabits();
      renderBadges();
    });
  });
}

