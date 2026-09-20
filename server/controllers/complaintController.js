const Complaint = require('../models/Complaint');
const IssueCluster = require('../models/IssueCluster');
const StatusHistory = require('../models/StatusHistory');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Verification = require('../models/Verification');
const aiService = require('../services/aiService');

// Instant AI preview for reporting page
const previewAI = async (req, res) => {
  try {
    const { text, location } = req.body;
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const aiResult = await aiService.analyzeCivicReport(text, imageUrl, location);
    res.json(aiResult);
  } catch (error) {
    res.status(500).json({ message: 'AI Analysis error', error: error.message });
  }
};

// Create new civic complaint and execute full AI pipeline
const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      lat,
      lng,
      categoryOverride,
      customSeverity
    } = req.body;

    if (!description && !title) {
      return res.status(400).json({ message: 'Complaint description is required' });
    }

    const reportText = `${title || ''}. ${description || ''}`.trim();
    const cleanLocation = location || 'Metropolitan Core District';
    const coordinates = {
      lat: lat ? parseFloat(lat) : 12.9716,
      lng: lng ? parseFloat(lng) : 77.5946,
    };

    // Images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(f => images.push(`/uploads/${f.filename}`));
    } else if (req.file) {
      images.push(`/uploads/${req.file.filename}`);
    } else if (req.body.imageUrl) {
      images.push(req.body.imageUrl);
    }

    // Step 1: AI Understanding & Classification
    const aiAnalysis = await aiService.analyzeCivicReport(reportText, images[0] || null, cleanLocation);

    const effectiveCategory = categoryOverride || aiAnalysis.category;
    const effectiveDepartment = aiAnalysis.department;
    const effectiveSeverity = customSeverity || aiAnalysis.severity;

    // Build complaint record
    const newComplaint = new Complaint({
      title: title || aiAnalysis.detectedIssue,
      description: description || reportText,
      images,
      location: cleanLocation,
      coordinates,
      category: effectiveCategory,
      department: effectiveDepartment,
      assignedDepartment: effectiveDepartment,
      severity: effectiveSeverity,
      publicImpact: aiAnalysis.publicImpact,
      summary: aiAnalysis.summary,
      keywords: aiAnalysis.keywords,
      priorityScore: aiAnalysis.priorityScore,
      priorityLevel: aiAnalysis.priorityLevel,
      impactFactors: aiAnalysis.impactFactors,
      status: 'AI_CLASSIFIED',
      reportedBy: req.user ? req.user._id : null,
      reporterName: req.user ? req.user.name : 'Citizen Observer',
      aiAnalysis: {
        detectedIssue: aiAnalysis.detectedIssue,
        confidence: aiAnalysis.confidence,
        possibleRisk: aiAnalysis.possibleRisk,
        suggestedCategory: aiAnalysis.category,
        suggestedDepartment: aiAnalysis.department,
        isFallback: aiAnalysis.isFallback,
        whyReasons: aiAnalysis.whyReasons,
      }
    });

    await newComplaint.save();

    // Step 2: Duplicate Intelligence & Cluster Detection
    const allComplaints = await Complaint.find({ _id: { $ne: newComplaint._id } });
    const clusterResult = await aiService.findOrCreateCluster(newComplaint, allComplaints, IssueCluster);

    // Save any cluster updates
    await newComplaint.save();

    // Step 3: Record Audit Timelines
    await StatusHistory.create({
      complaintId: newComplaint._id,
      status: 'REPORTED',
      stageTitle: 'Citizen Report Filed',
      comment: `Initial report captured with ${images.length} photo proof(s) at ${cleanLocation}.`,
      icon: 'MapPin',
      updatedBy: req.user ? req.user._id : null,
      updaterName: newComplaint.reporterName,
    });

    await StatusHistory.create({
      complaintId: newComplaint._id,
      status: 'AI_CLASSIFIED',
      stageTitle: `AI Analyzed: ${newComplaint.aiAnalysis.detectedIssue}`,
      comment: `Classified as ${newComplaint.category} → Recommended for ${newComplaint.department}. Severity: ${newComplaint.severity}.`,
      icon: 'Bot',
      updaterName: aiAnalysis.isFallback ? 'Civic Lens Fallback AI' : 'Civic Lens Gemini AI',
    });

    if (clusterResult.cluster) {
      await StatusHistory.create({
        complaintId: newComplaint._id,
        status: 'CLUSTER_LINKED',
        stageTitle: `${clusterResult.relatedCount} Related Reports Clustered`,
        comment: `Intelligent Spatial Clustering grouped this incident with ${clusterResult.similarityScore}% confidence. Impact boosted.`,
        icon: 'Network',
        updaterName: 'Civic Lens Duplicate Engine',
      });
    }

    await StatusHistory.create({
      complaintId: newComplaint._id,
      status: 'PRIORITIZED',
      stageTitle: `Civic Impact Score: ${newComplaint.priorityScore}/100 [${newComplaint.priorityLevel}]`,
      comment: `Scored based on severity (${newComplaint.impactFactors.severity}/40), public exposure (${newComplaint.impactFactors.publicExposure}/25), and report frequency.`,
      icon: 'Zap',
      updaterName: 'Civic Impact Scoring Core',
    });

    // Award Points to User
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { points: 10 }
      });

      // Notification to citizen
      await Notification.create({
        userId: req.user._id,
        complaintId: newComplaint._id,
        title: 'Report Received & AI Classified',
        message: `Your report "${newComplaint.title}" received a Civic Impact Score of ${newComplaint.priorityScore}/100. +10 points awarded!`,
        type: 'COMPLAINT_RECEIVED',
      });
    }

    // Emergency escalation check (Score >= 88 or Critical)
    if (newComplaint.priorityScore >= 88 || newComplaint.severity === 'Critical') {
      await Notification.create({
        title: '⚠ Urgent Civic Hazard Escalation',
        message: `High severity issue "${newComplaint.title}" at ${newComplaint.location} requires priority municipal dispatch. Impact: ${newComplaint.priorityScore}/100.`,
        type: 'EMERGENCY_ESCALATION',
        complaintId: newComplaint._id,
      });
    }

    res.status(201).json({
      message: 'Complaint processed successfully through AI pipeline',
      complaint: newComplaint,
      clusterResult,
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Failed to create report', error: error.message });
  }
};

// List all complaints with rich query filters
const getComplaints = async (req, res) => {
  try {
    const {
      category,
      department,
      status,
      priorityLevel,
      search,
      sortBy = 'priorityScore',
      limit = 50,
    } = req.query;

    const query = {};

    if (category && category !== 'All') query.category = category;
    if (department && department !== 'All') query.assignedDepartment = department;
    if (status && status !== 'All') query.status = status;
    if (priorityLevel && priorityLevel !== 'All') query.priorityLevel = priorityLevel;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = {};
    if (sortBy === 'priorityScore') sortOption = { priorityScore: -1, createdAt: -1 };
    else if (sortBy === 'newest') sortOption = { createdAt: -1 };
    else if (sortBy === 'oldest') sortOption = { createdAt: 1 };
    else sortOption = { priorityScore: -1 };

    const complaints = await Complaint.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .populate('duplicateGroupId')
      .populate('reportedBy', 'name email points');

    res.json({ count: complaints.length, complaints });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error: error.message });
  }
};

// Get single complaint with full intelligence context
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('reportedBy', 'name email points badges')
      .populate('duplicateGroupId');

    if (!complaint) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Get audit timeline
    const timeline = await StatusHistory.find({ complaintId: complaint._id }).sort({ timestamp: 1 });

    // Get verifications
    const verifications = await Verification.find({ complaintId: complaint._id }).sort({ timestamp: -1 });

    // Get other complaints in the same cluster if any
    let relatedReports = [];
    if (complaint.duplicateGroupId) {
      relatedReports = await Complaint.find({
        duplicateGroupId: complaint.duplicateGroupId._id,
        _id: { $ne: complaint._id }
      }).select('title location priorityScore status severity createdAt');
    }

    res.json({
      complaint,
      timeline,
      verifications,
      relatedReports,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching issue details', error: error.message });
  }
};

// Update assigned department (Authority / Admin override)
const updateDepartment = async (req, res) => {
  try {
    const { assignedDepartment, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Issue not found' });

    const prevDept = complaint.assignedDepartment;
    complaint.assignedDepartment = assignedDepartment;
    complaint.updatedAt = new Date();
    await complaint.save();

    await StatusHistory.create({
      complaintId: complaint._id,
      status: 'DEPARTMENT_REASSIGNED',
      stageTitle: `Department Routed: ${assignedDepartment}`,
      comment: comment || `Assigned to ${assignedDepartment} (AI recommended: ${complaint.department}).`,
      icon: 'Building',
      updatedBy: req.user ? req.user._id : null,
      updaterName: req.user ? req.user.name : 'Municipal Administrator',
    });

    res.json({ message: 'Department updated successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error updating department', error: error.message });
  }
};

// Update Status (Reported -> Assigned -> In Progress -> Awaiting Verification -> Resolved)
const updateStatus = async (req, res) => {
  try {
    const { status, comment, resolutionImage, resolutionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Issue not found' });

    const prevStatus = complaint.status;
    complaint.status = status;
    complaint.updatedAt = new Date();

    let uploadedResolutionImage = resolutionImage;
    if (req.file) {
      uploadedResolutionImage = `/uploads/${req.file.filename}`;
    }

    if (uploadedResolutionImage || resolutionNotes) {
      complaint.resolutionProof = {
        image: uploadedResolutionImage || (complaint.resolutionProof && complaint.resolutionProof.image),
        notes: resolutionNotes || '',
        resolvedBy: req.user ? req.user._id : null,
        resolvedByName: req.user ? req.user.name : 'Municipal Field Crew',
        resolvedAt: new Date(),
      };
    }

    await complaint.save();

    let stageTitle = `Status: ${status.replace(/_/g, ' ')}`;
    let icon = 'Clock';

    if (status === 'ASSIGNED') {
      stageTitle = `Assigned to ${complaint.assignedDepartment}`;
      icon = 'Briefcase';
    } else if (status === 'IN_PROGRESS') {
      stageTitle = 'Field Work In Progress';
      icon = 'Wrench';
    } else if (status === 'AWAITING_VERIFICATION') {
      stageTitle = 'Resolution Proof Uploaded — Awaiting Citizen Verification';
      icon = 'ShieldCheck';
    } else if (status === 'RESOLVED') {
      stageTitle = 'Officially Resolved & Verified';
      icon = 'CheckCircle2';
    }

    await StatusHistory.create({
      complaintId: complaint._id,
      status,
      stageTitle,
      comment: comment || (resolutionNotes ? `Resolution Proof: ${resolutionNotes}` : `Issue transitioned from ${prevStatus} to ${status}.`),
      icon,
      updatedBy: req.user ? req.user._id : null,
      updaterName: req.user ? req.user.name : 'Authority Dispatch',
    });

    // Notify citizen
    if (complaint.reportedBy) {
      let notifType = 'STATUS_CHANGED';
      let notifMsg = `Your reported issue "${complaint.title}" has transitioned to ${status.replace(/_/g, ' ')}.`;

      if (status === 'AWAITING_VERIFICATION') {
        notifType = 'VERIFICATION_REQUESTED';
        notifMsg = `Authorities have completed work on "${complaint.title}". Please verify the resolution with Before/After proof!`;
      } else if (status === 'RESOLVED') {
        notifType = 'RESOLVED';
        notifMsg = `Issue "${complaint.title}" is now verified and marked as RESOLVED ✓!`;
      }

      await Notification.create({
        userId: complaint.reportedBy,
        complaintId: complaint._id,
        title: stageTitle,
        message: notifMsg,
        type: notifType,
      });
    }

    res.json({ message: 'Status updated successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

module.exports = {
  previewAI,
  createComplaint,
  getComplaints,
  getComplaintById,
  updateDepartment,
  updateStatus,
};
