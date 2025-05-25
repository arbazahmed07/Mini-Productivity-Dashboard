const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

// Routes for tasks
// Fix: Access specific controller methods instead of passing the entire controller object
router.get('/', authenticateToken, taskController.getTasks);
router.post('/', authenticateToken, taskController.createTask);
router.get('/:id', authenticateToken, taskController.getTaskById);
router.put('/:id', authenticateToken, taskController.updateTask);
router.delete('/:id', authenticateToken, taskController.deleteTask);

module.exports = router;
