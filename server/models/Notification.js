const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // null means broadcast or system alert
  },
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'COMPLAINT_RECEIVED',
      'AI_CLASSIFIED',
      'CLUSTER_FOUND',
      'DEPARTMENT_ASSIGNED',
      'STATUS_CHANGED',
      'RESOLVED',
      'VERIFICATION_REQUESTED',
      'POINTS_AWARDED',
      'EMERGENCY_ESCALATION'
    ],
    default: 'STATUS_CHANGED',
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
