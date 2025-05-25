const Goal = require('./Goal');

const goalModel = {
  // Get all goals for a user
  findByUser: async (userId) => {
    return await Goal.find({ userId }).sort({ order: 1, createdAt: -1 });
  },
  
  // Find goal by ID
  findById: async (id) => {
    return await Goal.findById(id);
  },
  
  // Create new goal
  create: async (goalData) => {
    const goal = new Goal(goalData);
    return await goal.save();
  },
  
  // Update a goal
  update: async (id, goalData) => {
    try {
      // If updating progress, set lastUpdated automatically
      if ('progress' in goalData) {
        goalData.lastUpdated = new Date();
      }
      
      return await Goal.findByIdAndUpdate(
        id,
        goalData,
        { 
          new: true, // Return updated document
          runValidators: true // Run schema validations
        }
      );
    } catch (error) {
      console.error('Goal update error:', error);
      throw error;
    }
  },
  
  // Delete a goal
  delete: async (id) => {
    try {
      const result = await Goal.findByIdAndDelete(id);
      return result != null;
    } catch (error) {
      console.error('Goal deletion error:', error);
      throw error;
    }
  },
  
  // Reorder goals by updating order field
  reorder: async (goals) => {
    try {
      const operations = goals.map((goal, index) => ({
        updateOne: {
          filter: { _id: goal.id },
          update: { order: index }
        }
      }));
      
      await Goal.bulkWrite(operations);
      return true;
    } catch (error) {
      console.error('Goal reordering error:', error);
      throw error;
    }
  }
};

module.exports = { goalModel };
