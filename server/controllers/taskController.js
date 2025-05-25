// This assumes you have a taskModel similar to your userModel
const { taskModel } = require('../models/taskModel');

// Get all tasks for the authenticated user
const getTasks = async (req, res) => {
  try {
    const tasks = await taskModel.find({ userId: req.user.id });
    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    
    // Create task with the authenticated user's ID
    const newTask = await taskModel.create({
      userId: req.user.id,
      title,
      description,
      dueDate,
      priority,
      status: status || 'pending'
    });
    
    res.status(201).json({
      success: true,
      task: newTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get a specific task by ID
const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await taskModel.findOne({ _id: taskId, userId: req.user.id });
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found or not authorized' 
      });
    }
    
    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;
    
    // Make sure user can only update their own tasks
    const task = await taskModel.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      updates,
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found or not authorized to update' 
      });
    }
    
    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Make sure user can only delete their own tasks
    const task = await taskModel.findOneAndDelete({ _id: taskId, userId: req.user.id });
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found or not authorized to delete' 
      });
    }
    
    res.json({
      success: true,
      message: 'Task successfully deleted',
      taskId
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
};
