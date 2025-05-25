const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// GET /api/daily/stats - Get daily task completion statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find tasks for today
    const todayTasks = await Task.find({
      userId,
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    const totalTasks = todayTasks.length;
    const completedTasks = todayTasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Calculate task streak
    const taskStreak = await calculateTaskStreak(userId);
    
    res.json({
      date: today.toISOString(),
      userId,
      totalTasks,
      completedTasks,
      completionRate,
      taskStreak
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/daily/streak - Get combined streak information
router.get('/streak', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Calculate task streak
    const taskStreak = await calculateTaskStreak(userId);
    
    // Get login streak from user model
    const userStreakInfo = await userModel.getUserStreakInfo(userId);
    const loginStreak = userStreakInfo?.loginStreak || 0;
    
    // Combined streak (minimum of both)
    const combinedStreak = Math.min(taskStreak, loginStreak);
    
    res.json({
      taskStreak,
      loginStreak,
      combinedStreak
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Helper function to calculate task streak
async function calculateTaskStreak(userId) {
  try {
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Check up to 100 days back (arbitrary limit)
    for (let i = 0; i < 100; i++) {
      // Check if there's at least one completed task for this day
      const startOfDay = new Date(currentDate);
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const tasksForDay = await Task.find({
        userId,
        completed: true,
        completedAt: { $gte: startOfDay, $lt: nextDay }
      });
      
      // If no completed tasks for this day, break the streak
      if (tasksForDay.length === 0) {
        break;
      }
      
      streak++;
      
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  } catch (error) {
    console.error('Calculate task streak error:', error);
    return 0;
  }
}

module.exports = router;
