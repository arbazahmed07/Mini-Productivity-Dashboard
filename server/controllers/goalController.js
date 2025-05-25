// This assumes you have a goalModel similar to your other models
const { goalModel } = require('../models/goalModel');

// Get all goals for the authenticated user
const getGoals = async (req, res) => {
  try {
    const goals = await goalModel.find({ userId: req.user.id });
    res.json({
      success: true,
      goals
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create a new goal
const createGoal = async (req, res) => {
  try {
    const { title, description, targetDate, targetValue, currentValue, category } = req.body;
    
    // Create goal with the authenticated user's ID
    const newGoal = await goalModel.create({
      userId: req.user.id,
      title,
      description,
      targetDate,
      targetValue,
      currentValue: currentValue || 0,
      category,
      progress: currentValue ? (currentValue / targetValue) * 100 : 0,
      status: 'active'
    });
    
    res.status(201).json({
      success: true,
      goal: newGoal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get a specific goal by ID
const getGoalById = async (req, res) => {
  try {
    const goalId = req.params.id;
    const goal = await goalModel.findOne({ _id: goalId, userId: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found or not authorized' 
      });
    }
    
    res.json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Get goal by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update a goal
const updateGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    const updates = req.body;
    
    // Update progress if targetValue and currentValue are present
    if (updates.targetValue !== undefined && updates.currentValue !== undefined) {
      updates.progress = (updates.currentValue / updates.targetValue) * 100;
    }
    
    // Make sure user can only update their own goals
    const goal = await goalModel.findOneAndUpdate(
      { _id: goalId, userId: req.user.id },
      updates,
      { new: true }
    );
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found or not authorized to update' 
      });
    }
    
    res.json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete a goal
const deleteGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    
    // Make sure user can only delete their own goals
    const goal = await goalModel.findOneAndDelete({ _id: goalId, userId: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found or not authorized to delete' 
      });
    }
    
    res.json({
      success: true,
      message: 'Goal successfully deleted',
      goalId
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getGoals,
  createGoal,
  getGoalById,
  updateGoal,
  deleteGoal
};
