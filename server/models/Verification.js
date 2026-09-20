const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  userName: {
    type: String,
    default: 'Civic Contributor',
  },
  result: {
    type: String,
    enum: ['RESOLVED', 'PARTIALLY_RESOLVED', 'STILL_EXISTS'],
    required: true,
  },
  comment: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: null,
  },
  pointsAwarded: {
    type: Number,
    default: 5,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Verification', verificationSchema);
