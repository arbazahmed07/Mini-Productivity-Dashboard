const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  activity: {
    lastLogin: {
      type: Date,
      default: Date.now
    },
    loginDates: [Date],
    loginStreak: {
      type: Number,
      default: 0
    },
    maxLoginStreak: {
      type: Number,
      default: 0
    },
    taskStreak: {
      type: Number,
      default: 0
    },
    combinedStreak: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to track user login and update streak
userSchema.statics.trackLogin = async function(userId) {
  const user = await this.findById(userId);
  if (!user) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const lastLoginDate = user.activity.lastLogin ? 
    new Date(user.activity.lastLogin.getFullYear(), user.activity.lastLogin.getMonth(), user.activity.lastLogin.getDate()) : 
    null;

  // Update login streak
  if (lastLoginDate) {
    const diffTime = today - lastLoginDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day login
      user.activity.loginStreak += 1;
    } else if (diffDays > 1) {
      // Streak broken
      user.activity.loginStreak = 1;
    }
    // If diffDays === 0, same day login, don't change streak
  } else {
    // First login
    user.activity.loginStreak = 1;
  }

  // Update max streak if needed
  if (user.activity.loginStreak > user.activity.maxLoginStreak) {
    user.activity.maxLoginStreak = user.activity.loginStreak;
  }

  // Add today's date if not already in loginDates
  if (!lastLoginDate || today.getTime() !== lastLoginDate.getTime()) {
    user.activity.loginDates.push(today);
  }
  
  user.activity.lastLogin = now;
  
  await user.save();
  return user;
};

// Method to get user streak information
userSchema.statics.getUserStreakInfo = async function(userId) {
  const user = await this.findById(userId);
  if (!user) return null;
  
  return {
    loginStreak: user.activity.loginStreak,
    taskStreak: user.activity.taskStreak,
    combinedStreak: user.activity.combinedStreak,
    maxLoginStreak: user.activity.maxLoginStreak,
    lastLogin: user.activity.lastLogin
  };
};

const User = mongoose.model('User', userSchema);

const userModel = {
  model: User,
  trackLogin: User.trackLogin.bind(User),
  getUserStreakInfo: User.getUserStreakInfo.bind(User)
};

module.exports = { userModel };
