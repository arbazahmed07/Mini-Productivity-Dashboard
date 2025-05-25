const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { 
  getProfile, 
  updateProfile, 
  checkAuthStatus 
} = require('../controllers/profileController');

// Route to check if user is authenticated
router.get('/auth-status', authenticateToken, checkAuthStatus);

// Protected routes - require authentication
router.get('/me', authenticateToken, getProfile);
router.put('/update', authenticateToken, updateProfile);

// Export the router
module.exports = router;
