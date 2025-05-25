const express = require('express');
const router = express.Router();
const { userModel } = require('../models/userModel');
const { authenticateToken } = require('../middleware/auth');

// POST /api/users/track-login - Track user login and update streak
router.post('/track-login', authenticateToken, async (req, res) => {
  try {
    const updatedUser = await userModel.trackLogin(req.user.id);
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Return just the activity data
    const { activity } = updatedUser;
    res.json({
      lastLogin: activity.lastLogin,
      loginDates: activity.loginDates,
      loginStreak: activity.loginStreak
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/users/streak-info - Get user streak information
router.get('/streak-info', authenticateToken, async (req, res) => {
  try {
    const streakInfo = await userModel.getUserStreakInfo(req.user.id);
    if (!streakInfo) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(streakInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Other user routes would go here

module.exports = router;
