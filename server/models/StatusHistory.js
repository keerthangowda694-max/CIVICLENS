const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  stageTitle: {
    type: String,
    default: '',
  },
  comment: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'CheckCircle',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updaterName: {
    type: String,
    default: 'Civic Lens System',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StatusHistory', statusHistorySchema);
