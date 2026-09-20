const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['citizen', 'authority', 'admin'],
    default: 'citizen',
  },
  department: {
    type: String,
    default: null, // e.g. 'Public Works', 'Municipal Sanitation', etc.
  },
  points: {
    type: Number,
    default: 10,
  },
  badges: [{
    id: String,
    name: String,
    icon: String,
    description: String,
    awardedAt: { type: Date, default: Date.now },
  }],
  area: {
    type: String,
    default: 'Central City Zone',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
