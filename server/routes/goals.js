const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const goalController = require('../controllers/goalController');

// Routes for goals
router.get('/', authenticateToken, goalController.getGoals);
router.post('/', authenticateToken, goalController.createGoal);
router.get('/:id', authenticateToken, goalController.getGoalById);
router.put('/:id', authenticateToken, goalController.updateGoal);
router.delete('/:id', authenticateToken, goalController.deleteGoal);

module.exports = router;
