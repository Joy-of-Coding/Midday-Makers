
// app.js
console.log('🚀 App.js loading...');

// Optional: Import streak utilities for better organization
let StreakUtils = null;
try {
  // Try to import streak utilities
  import('./utilities/streaks.js').then(module => {
    StreakUtils = module;
    console.log('📦 Streak utilities loaded:', StreakUtils);
  }).catch(error => {
    console.warn('⚠️ Streak utilities not available, using built-in functions:', error);
  });
} catch (error) {
  console.warn('⚠️ Streak utilities import failed, using built-in functions:', error);
}

// Feature detection and polyfills
function checkBrowserSupport() {
  const issues = [];
  
  if (!window.fetch) {
    issues.push('Fetch API not supported');
  }
  
  if (typeof Storage === 'undefined') {
    issues.push('LocalStorage not supported');
  }
  
  if (!window.Set) {
    issues.push('Set not supported');
  }
  
  return issues;
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('🚨 Global error caught:', event.error);
  showUserFriendlyError('Something went wrong. Please refresh the page.');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled promise rejection:', event.reason);
  showUserFriendlyError('Network error. Please check your connection.');
});

// XP tracking variables
let dailyXP = 0;
let totalXP = 0;

// Safe localStorage operations with fallbacks
function safeLocalStorage() {
  try {
    if (typeof Storage !== 'undefined') {
      return localStorage;
    }
  } catch (error) {
    console.warn('localStorage not available:', error);
  }
  
  // Fallback to sessionStorage or memory
  return {
    getItem: (key) => sessionStorage.getItem(key) || null,
    setItem: (key, value) => {
      try {
        sessionStorage.setItem(key, value);
      } catch (error) {
        console.warn('sessionStorage failed, using memory fallback');
        // Memory fallback
        if (!window.memoryStorage) window.memoryStorage = {};
        window.memoryStorage[key] = value;
      }
    }
  };
}

const storage = safeLocalStorage();

// Load XP from storage with error handling
function loadXP() {
  try {
    const savedDailyXP = storage.getItem('dailyXP');
    const savedTotalXP = storage.getItem('totalXP');
    
    if (savedDailyXP) dailyXP = parseInt(savedDailyXP) || 0;
    if (savedTotalXP) totalXP = parseInt(savedTotalXP) || 0;
    
    updateXPDisplay();
  } catch (error) {
    console.warn('Failed to load XP:', error);
    dailyXP = 0;
    totalXP = 0;
  }
}

// Save XP to storage with error handling
function saveXP() {
  try {
    storage.setItem('dailyXP', dailyXP.toString());
    storage.setItem('totalXP', totalXP.toString());
  } catch (error) {
    console.warn('Failed to save XP:', error);
  }
}

// Update XP display
function updateXPDisplay() {
  try {
    const dailyXPElement = document.getElementById('xp');
    const totalXPElement = document.getElementById('total-xp');
    
    if (dailyXPElement) dailyXPElement.textContent = dailyXP;
    if (totalXPElement) totalXPElement.textContent = totalXP;
  } catch (error) {
    console.warn('Failed to update XP display:', error);
  }
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

// Show notification with error handling
function showNotification(message) {
  try {
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
  } catch (error) {
    console.warn('Failed to show notification:', error);
    // Fallback: simple alert
    alert(message);
  }
}

// Show user-friendly error messages
function showUserFriendlyError(message) {
  try {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'user-error';
    errorDiv.innerHTML = `
      <div class="error-content">
        <h3>⚠️ Oops!</h3>
        <p>${message}</p>
        <button onclick="location.reload()">🔄 Refresh Page</button>
      </div>
    `;
    
    Object.assign(errorDiv.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '10000'
    });
    
    document.body.appendChild(errorDiv);
  } catch (error) {
    console.error('Failed to show error message:', error);
    alert(`Error: ${message}`);
  }
}

// Retry mechanism for network requests
async function loadWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed for ${url}:`, error);
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, i), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Check if it's a new day and reset daily XP
function checkNewDay() {
  try {
    const today = new Date().toDateString();
    const lastReset = storage.getItem('lastXPReset');
    
    if (lastReset !== today) {
      // Reset daily XP
      dailyXP = 0;
      storage.setItem('lastXPReset', today);
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
  } catch (error) {
    console.warn('Failed to check new day:', error);
  }
}

// Reset all habit buttons to inactive state
function resetHabitButtonStates() {
  try {
    const habitButtons = document.querySelectorAll('.habit-btn');
    habitButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.style.background = '';
      btn.style.color = '';
    });
    console.log('🔄 Reset habit button visual states');
  } catch (error) {
    console.warn('Failed to reset habit button states:', error);
  }
}

// Badge system with Set polyfill
let completedHabits;
if (typeof Set !== 'undefined') {
  completedHabits = new Set();
} else {
  // Simple Set polyfill
  completedHabits = {
    add: function(item) { this[item] = true; },
    delete: function(item) { delete this[item]; },
    has: function(item) { return this[item] === true; },
    clear: function() { Object.keys(this).forEach(key => delete this[key]); },
    size: Object.keys(this).length
  };
}

// Load completed habits from storage with error handling
function loadCompletedHabits() {
  try {
    const saved = storage.getItem('completedHabits');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        parsed.forEach(habit => completedHabits.add(habit));
      }
    }
  } catch (error) {
    console.warn('Failed to load completed habits:', error);
    completedHabits.clear();
  }
}

// Save completed habits to storage with error handling
function saveCompletedHabits() {
  try {
    const habitsArray = Array.from(completedHabits);
    storage.setItem('completedHabits', JSON.stringify(habitsArray));
  } catch (error) {
    console.warn('Failed to save completed habits:', error);
  }
}

// Get current streak with error handling
function getCurrentStreak() {
  try {
    // Use utility function if available, otherwise use built-in
    if (StreakUtils && StreakUtils.getCurrentStreak) {
      return StreakUtils.getCurrentStreak();
    }
    
    // Built-in fallback
    console.log('🔄 getCurrentStreak() called (built-in)');
    const streak = storage.getItem('currentStreak') || 0;
    const result = parseInt(streak) || 0;
    console.log('📈 Current streak from storage:', streak, 'Parsed as:', result);
    return result;
  } catch (error) {
    console.warn('Failed to get current streak:', error);
    return 0;
  }
}

// Check if habits were completed today
function hasCompletedHabitsToday() {
  try {
    return completedHabits.size > 0;
  } catch (error) {
    console.warn('Failed to check completed habits:', error);
    return false;
  }
}

// Update streak with error handling
function updateStreak() {
  try {
    // Use utility function if available, otherwise use built-in
    if (StreakUtils && StreakUtils.updateStreak) {
      return StreakUtils.updateStreak();
    }
    
    // Built-in fallback
    console.log('🔄 updateStreak() called (built-in)');
    const today = new Date().toDateString();
    const lastStreakUpdate = storage.getItem('lastStreakUpdate');
    
    console.log('📅 Today:', today, 'Last update:', lastStreakUpdate);
    
    // Only update streak once per day
    if (lastStreakUpdate !== today) {
      const currentStreak = getCurrentStreak();
      const newStreak = currentStreak + 1;
      storage.setItem('currentStreak', newStreak.toString());
      storage.setItem('lastStreakUpdate', today);
      console.log('📈 Streak updated to:', newStreak);
      return newStreak;
    } else {
      const currentStreak = getCurrentStreak();
      console.log('📈 Streak already updated today, current streak:', currentStreak);
      return currentStreak;
    }
  } catch (error) {
    console.warn('Failed to update streak:', error);
    return 0;
  }
}

// Reset streak for new day
function resetDailyStreak() {
  try {
    // Use utility function if available, otherwise use built-in
    if (StreakUtils && StreakUtils.resetDailyStreak) {
      StreakUtils.resetDailyStreak();
      return;
    }
    
    // Built-in fallback
    storage.setItem('currentStreak', '0');
    storage.removeItem('lastStreakUpdate');
    console.log('🔄 Daily streak reset to 0 (built-in)');
  } catch (error) {
    console.warn('Failed to reset daily streak:', error);
  }
}

// Render badges section with error handling
function renderBadges() {
  try {
    const badgesSection = document.getElementById('badges');
    if (!badgesSection) return;
    
    const currentStreak = getCurrentStreak();
    const completedCount = completedHabits.size;
    
    const badges = [
      { id: 'first-habit', name: 'First Step', icon: '🎯', description: 'Complete your first habit', type: 'count', current: completedCount, required: 1 },
      { id: 'three-habits', name: 'Triple Threat', icon: '🔥', description: 'Complete 3 habits', type: 'count', current: completedCount, required: 3 },
      { id: 'all-habits', name: 'Habit Master', icon: '👑', description: 'Complete all 9 habits', type: 'count', current: completedCount, required: 9 },
      { id: 'streak-3', name: 'Consistent', icon: '📈', description: '3-day streak', type: 'streak', current: currentStreak, required: 3 },
      { id: 'streak-7', name: 'Week Warrior', icon: '🏆', description: '7-day streak', type: 'streak', current: currentStreak, required: 7 }
    ];
    
    badgesSection.innerHTML = `
      <h2>🏆 Achievement Badges</h2>
      <div class="badges-grid">
        ${badges.map(badge => {
          const isUnlocked = isBadgeUnlocked(badge.id);
          const progressText = badge.type === 'streak' 
            ? `${badge.current}/${badge.required} days`
            : `${badge.current}/${badge.required} habits`;
          
          return `
            <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
              <div class="badge-icon">${badge.icon}</div>
              <div class="badge-label">${badge.name}</div>
              <div class="badge-description">${badge.description}</div>
              <div class="badge-progress">${progressText}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Failed to render badges:', error);
    showUserFriendlyError('Failed to load badges. Please refresh the page.');
  }
}

// Check if a badge should be unlocked with error handling
function isBadgeUnlocked(badgeId) {
  try {
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
      case 'streak-7':
        // Use utility function if available for streak badges
        if (StreakUtils && StreakUtils.isStreakBadgeUnlocked) {
          result = StreakUtils.isStreakBadgeUnlocked(badgeId, currentStreak);
        } else {
          // Built-in fallback
          result = badgeId === 'streak-3' ? currentStreak >= 3 : currentStreak >= 7;
        }
        break;
      default:
        result = false;
        break;
    }
    
    console.log(`🏆 Badge ${badgeId} result:`, result);
    return result;
  } catch (error) {
    console.warn('Failed to check badge unlock status:', error);
    return false;
  }
}

// Main app initialization with comprehensive error handling
document.addEventListener("DOMContentLoaded", async () => {
  console.log('🎯 DOM Content Loaded');
  
  try {
    // Check browser support first
    const browserIssues = checkBrowserSupport();
    if (browserIssues.length > 0) {
      console.warn('Browser compatibility issues:', browserIssues);
      showUserFriendlyError(`Your browser may not support all features: ${browserIssues.join(', ')}`);
    }
    
    // Show loading page initially
    showLoadingPage();
    
    // Initialize XP system
    loadXP();
    checkNewDay();
    
    // Initialize badge system
    loadCompletedHabits();
    
    // Import the habit picker module with error handling
    let habitPickerModule;
    try {
      habitPickerModule = await import("./components/habitPicker.js");
      console.log('📦 Habit picker module loaded:', habitPickerModule);
    } catch (error) {
      console.error('Failed to load habit picker module:', error);
      showUserFriendlyError('Failed to load app components. Please refresh the page.');
      return;
    }
    
    // Load and render habits with retry mechanism
    console.log('📋 Loading categories...');
    try {
      const response = await loadWithRetry("./data/categories.json");
      const categories = await response.json();
      console.log('📋 Categories loaded:', categories);
      
      habitPickerModule.renderHabits(categories);
      console.log('📋 renderHabits called');
      
      // Set up habit click listeners after rendering
      setTimeout(() => {
        setupHabitListeners();
        renderBadges();
        
        // Hide loading page and show main app (reduced time for better UX)
        setTimeout(() => {
          hideLoadingPage();
        }, 3000); // Reduced from 8000ms to 3000ms
      }, 100);
      
    } catch (err) {
      console.error("❌ Error loading categories:", err);
      showUserFriendlyError('Failed to load habits. Please check your connection and refresh.');
      
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
        renderBadges();
        
        // Hide loading page and show main app
        setTimeout(() => {
          hideLoadingPage();
        }, 3000);
      }, 100);
    }

    // Theme toggle with error handling
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      console.log('🌓 Setting up theme toggle');
      themeToggle.addEventListener("click", () => {
        try {
          console.log('🌓 Theme toggle clicked');
          document.body.classList.toggle("dark");
          themeToggle.textContent = document.body.classList.contains("dark") ? "🌗" : "🌙";
        } catch (error) {
          console.warn('Failed to toggle theme:', error);
        }
      });
    }

    console.log('✅ App initialization complete');
    
  } catch (error) {
    console.error('❌ App initialization failed:', error);
    showUserFriendlyError('App failed to start. Please refresh the page.');
  }
});

// Loading page functions with error handling
function showLoadingPage() {
  try {
    const loadingPage = document.getElementById('loading-page');
    const mainApp = document.getElementById('main-app');
    
    if (loadingPage) loadingPage.style.display = 'flex';
    if (mainApp) mainApp.style.display = 'none';
  } catch (error) {
    console.warn('Failed to show loading page:', error);
  }
}

function hideLoadingPage() {
  try {
    const loadingPage = document.getElementById('loading-page');
    const mainApp = document.getElementById('main-app');
    
    if (loadingPage) {
      loadingPage.style.opacity = '0';
      loadingPage.style.transform = 'scale(0.95)';
      loadingPage.style.transition = 'all 0.5s ease';
      
      setTimeout(() => {
        loadingPage.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
        
        // Fade in main app
        mainApp.style.opacity = '0';
        mainApp.style.transform = 'translateY(20px)';
        mainApp.style.transition = 'all 0.5s ease';
        
        requestAnimationFrame(() => {
          mainApp.style.opacity = '1';
          mainApp.style.transform = 'translateY(0)';
        });
      }, 500);
    }
  } catch (error) {
    console.warn('Failed to hide loading page:', error);
  }
}

function showLoadingError(error) {
  try {
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
      loadingText.textContent = 'Something went wrong. Please refresh the page.';
      loadingText.style.color = '#ff6b6b';
    }
    console.error('Loading error:', error);
  } catch (err) {
    console.error('Failed to show loading error:', err);
  }
}

// Set up habit click listeners with error handling
function setupHabitListeners() {
  try {
    const habitButtons = document.querySelectorAll('.habit-btn');
    console.log('🎯 Setting up listeners for', habitButtons.length, 'habit buttons');
    
    habitButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        try {
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
        } catch (error) {
          console.error('Failed to handle habit click:', error);
          showUserFriendlyError('Failed to update habit. Please try again.');
        }
      });
    });
  } catch (error) {
    console.error('Failed to setup habit listeners:', error);
    showUserFriendlyError('Failed to setup habit tracking. Please refresh the page.');
  }
}

