const mongoose = require('mongoose');

const issueClusterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    default: 'Public Works',
  },
  complaintIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
  }],
  leadComplaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  similarityScore: {
    type: Number,
    default: 87, // % similarity
  },
  impactScore: {
    type: Number,
    default: 75,
  },
  reportCount: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INVESTIGATING', 'RESOLVED'],
    default: 'ACTIVE',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('IssueCluster', issueClusterSchema);
