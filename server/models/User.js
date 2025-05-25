const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  bio: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  jobTitle: {
    type: String,
    default: ''
  }
}, { _id: false });

const ActivitySchema = new mongoose.Schema({
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginDates: {
    type: [Date],
    default: []
  },
  loginStreak: {
    type: Number,
    default: 1
  },
  maxLoginStreak: {
    type: Number,
    default: 1
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    type: ProfileSchema,
    default: () => ({})
  },
  activity: {
    type: ActivitySchema,
    default: () => ({
      lastLogin: new Date(),
      loginDates: [new Date()],
      loginStreak: 1,
      maxLoginStreak: 1
    })
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Remove password when converting to JSON
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', UserSchema);
