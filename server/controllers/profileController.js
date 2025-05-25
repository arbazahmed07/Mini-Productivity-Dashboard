// const { userModel } = require('../models/userModel');

// const getProfile = async (req, res) => {
//   try {
//     // This route is already protected by authenticateToken middleware
//     // So we know req.user.id is available and valid
//     const user = await userModel.findById(req.user.id);
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'User not found' 
//       });
//     }
    
//     // Return authenticated user's profile data
//     res.json({
//       success: true,
//       user: {
//         id: user._id,
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         profile: user.profile || {}
//       }
//     });
//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error', 
//       error: error.message 
//     });
//   }
// };

// // Check if the user is logged in without returning full profile
// const checkAuthStatus = async (req, res) => {
//   try {
//     // If middleware passes, user is authenticated
//     res.json({ 
//       success: true,
//       isLoggedIn: true,
//       userId: req.user.id
//     });
//   } catch (error) {
//     res.json({ 
//       success: false,
//       isLoggedIn: false 
//     });
//   }
// };

// const updateProfile = async (req, res) => {
//   try {
//     const { name, bio, avatarUrl, jobTitle } = req.body;
    
//     const user = await userModel.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     // Prepare update data
//     const updateData = {};
//     if (name !== undefined) updateData.name = name;
    
//     // Build profile update object
//     if (bio !== undefined || avatarUrl !== undefined || jobTitle !== undefined) {
//       // Create a profile update using $set for nested fields
//       const profileUpdates = {};
      
//       if (bio !== undefined) profileUpdates['profile.bio'] = bio;
//       if (avatarUrl !== undefined) profileUpdates['profile.avatarUrl'] = avatarUrl;
//       if (jobTitle !== undefined) profileUpdates['profile.jobTitle'] = jobTitle;
      
//       Object.assign(updateData, profileUpdates);
//     }
    
//     // Update user
//     const updatedUser = await userModel.update(req.user.id, updateData);
    
//     if (!updatedUser) {
//       return res.status(400).json({ message: 'Failed to update profile' });
//     }
    
//     // Return updated user info
//     res.json({
//       id: updatedUser._id,
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       profile: updatedUser.profile || {}
//     });
//   } catch (error) {
//     console.error('Update profile error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Make sure all functions are defined before exporting
// console.log('Exporting profile controller functions:', 
//   typeof getProfile === 'function', 
//   typeof updateProfile === 'function', 
//   typeof checkAuthStatus === 'function'
// );

// module.exports = {
//   getProfile,
//   updateProfile,
//   checkAuthStatus
// };


const { userModel } = require('../models/userModel');

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

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
    const { name, bio, avatarUrl, jobTitle } = req.body;

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;

    if (bio !== undefined || avatarUrl !== undefined || jobTitle !== undefined) {
      if (bio !== undefined) updateData['profile.bio'] = bio;
      if (avatarUrl !== undefined) updateData['profile.avatarUrl'] = avatarUrl;
      if (jobTitle !== undefined) updateData['profile.jobTitle'] = jobTitle;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: 'Failed to update profile' });
    }

    res.json({
      id: updatedUser._id,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profile: updatedUser.profile || {}
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
