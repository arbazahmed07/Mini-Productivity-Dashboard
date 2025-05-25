const { userModel } = require('../models/userModel');

const getProfile = async (req, res) => {
  try {
    // Use userModel.model.findById instead of userModel.findById
    const user = await userModel.model.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile || {}
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

const checkAuthStatus = async (req, res) => {
  try {
    res.json({ 
      success: true,
      isLoggedIn: true,
      userId: req.user.id
    });
  } catch (error) {
    res.json({ 
      success: false,
      isLoggedIn: false 
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log("Updating profile");
    const { name, bio, avatarUrl, jobTitle } = req.body;

    // Use userModel.model.findById instead of userModel.findById
    const user = await userModel.model.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name !== undefined) user.name = name;
    
    // Ensure profile object exists
    if (!user.profile) {
      user.profile = {};
    }
    
    // Update profile fields if provided
    if (bio !== undefined) user.profile.bio = bio;
    if (avatarUrl !== undefined) user.profile.avatarUrl = avatarUrl;
    if (jobTitle !== undefined) user.profile.jobTitle = jobTitle;

    // Save the user with updated fields
    await user.save();

    res.json({
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile || {}
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

console.log('Exporting profile controller functions:', 
  typeof getProfile === 'function', 
  typeof updateProfile === 'function', 
  typeof checkAuthStatus === 'function'
);

module.exports = {
  getProfile,
  updateProfile,
  checkAuthStatus
};
