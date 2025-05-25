const Task = require('./Task');

const taskModel = {
  // Get all tasks for a user
  findByUser: async (userId) => {
    return await Task.find({ userId }).sort({ order: 1, createdAt: -1 });
  },
  
  // Find task by ID
  findById: async (id) => {
    return await Task.findById(id);
  },
  
  // Create new task
  create: async (taskData) => {
    const task = new Task(taskData);
    return await task.save();
  },
  
  // Update a task
  update: async (id, taskData) => {
    try {
      return await Task.findByIdAndUpdate(
        id,
        taskData,
        { 
          new: true, // Return updated document
          runValidators: true // Run schema validations
        }
      );
    } catch (error) {
      console.error('Task update error:', error);
      throw error;
    }
  },
  
  // Delete a task
  delete: async (id) => {
    try {
      const result = await Task.findByIdAndDelete(id);
      return result != null;
    } catch (error) {
      console.error('Task deletion error:', error);
      throw error;
    }
  },
  
  // Reorder tasks by updating order field
  reorder: async (tasks) => {
    try {
      const operations = tasks.map((task, index) => ({
        updateOne: {
          filter: { _id: task.id },
          update: { order: index }
        }
      }));
      
      await Task.bulkWrite(operations);
      return true;
    } catch (error) {
      console.error('Task reordering error:', error);
      throw error;
    }
  }
};

module.exports = { taskModel };
