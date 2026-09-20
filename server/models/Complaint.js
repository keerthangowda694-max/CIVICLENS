const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String, // URL or upload path
  }],
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
      default: 12.9716, // Default metro city
    },
    lng: {
      type: Number,
      required: true,
      default: 77.5946,
    },
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Road Infrastructure',
      'Municipal Sanitation',
      'Water Supply & Drainage',
      'Electrical & Lighting',
      'Traffic & Transport',
      'Public Safety & Infrastructure',
      'Other'
    ],
    default: 'Road Infrastructure',
  },
  department: {
    type: String,
    default: 'Public Works', // AI recommended department
  },
  assignedDepartment: {
    type: String,
    default: 'Public Works', // Actual assigned department (overridable)
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  publicImpact: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Severe'],
    default: 'Medium',
  },
  summary: {
    type: String,
    default: '',
  },
  keywords: [{
    type: String,
  }],
  // Civic Impact Score: 0 to 100
  priorityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50,
  },
  priorityLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM',
  },
  // Detailed 5-metric breakdown for explainable AI
  impactFactors: {
    severity: { type: Number, default: 20, max: 40 },        // out of 40
    publicExposure: { type: Number, default: 12, max: 25 },  // out of 25
    reportFrequency: { type: Number, default: 8, max: 20 },  // out of 20
    locationImportance: { type: Number, default: 5, max: 10 },// out of 10
    recency: { type: Number, default: 5, max: 5 },           // out of 5
  },
  status: {
    type: String,
    enum: [
      'REPORTED',
      'AI_CLASSIFIED',
      'ASSIGNED',
      'IN_PROGRESS',
      'AWAITING_VERIFICATION',
      'RESOLVED',
      'REJECTED'
    ],
    default: 'REPORTED',
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  reporterName: {
    type: String,
    default: 'Anonymous Citizen',
  },
  duplicateGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IssueCluster',
    default: null,
  },
  isClusterLeader: {
    type: Boolean,
    default: false,
  },
  relatedReportsCount: {
    type: Number,
    default: 1,
  },
  aiAnalysis: {
    detectedIssue: String,
    confidence: Number,
    possibleRisk: String,
    suggestedCategory: String,
    suggestedDepartment: String,
    isFallback: Boolean,
    whyReasons: [String],
    extractedAt: { type: Date, default: Date.now },
  },
  resolutionProof: {
    image: String,
    notes: String,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedByName: String,
    resolvedAt: Date,
  },
  verificationSummary: {
    totalVotes: { type: Number, default: 0 },
    resolvedVotes: { type: Number, default: 0 },
    partialVotes: { type: Number, default: 0 },
    unresolvedVotes: { type: Number, default: 0 },
    status: { type: String, default: 'PENDING' }, // PENDING, CONFIRMED_RESOLVED, CONTESTED
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

module.exports = mongoose.model('Complaint', complaintSchema);
