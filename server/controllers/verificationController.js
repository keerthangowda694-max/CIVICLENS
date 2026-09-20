const Verification = require('../models/Verification');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const StatusHistory = require('../models/StatusHistory');
const Notification = require('../models/Notification');

// Submit Citizen Verification
const submitVerification = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { result, comment } = req.body;
    
    if (!result || !['RESOLVED', 'PARTIALLY_RESOLVED', 'STILL_EXISTS'].includes(result)) {
      return res.status(400).json({ message: 'Valid result choice is required (RESOLVED, PARTIALLY_RESOLVED, STILL_EXISTS)' });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    let image = null;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const verification = new Verification({
      complaintId,
      userId: req.user ? req.user._id : null,
      userName: req.user ? req.user.name : 'Citizen Observer',
      result,
      comment: comment || '',
      image,
      pointsAwarded: 5,
    });
    await verification.save();

    // Update complaint verification tally
    if (!complaint.verificationSummary) {
      complaint.verificationSummary = {
        totalVotes: 0,
        resolvedVotes: 0,
        partialVotes: 0,
        unresolvedVotes: 0,
        status: 'PENDING'
      };
    }

    complaint.verificationSummary.totalVotes = (complaint.verificationSummary.totalVotes || 0) + 1;
    if (result === 'RESOLVED') {
      complaint.verificationSummary.resolvedVotes = (complaint.verificationSummary.resolvedVotes || 0) + 1;
    } else if (result === 'PARTIALLY_RESOLVED') {
      complaint.verificationSummary.partialVotes = (complaint.verificationSummary.partialVotes || 0) + 1;
    } else if (result === 'STILL_EXISTS') {
      complaint.verificationSummary.unresolvedVotes = (complaint.verificationSummary.unresolvedVotes || 0) + 1;
    }

    // Determine final status
    let updatedStatus = complaint.status;
    let stageTitle = '';
    let stageComment = '';

    if (complaint.verificationSummary.resolvedVotes >= 1 && complaint.verificationSummary.unresolvedVotes === 0) {
      updatedStatus = 'RESOLVED';
      complaint.status = 'RESOLVED';
      complaint.verificationSummary.status = 'CONFIRMED_RESOLVED';
      stageTitle = 'Citizen Verified: Resolution Confirmed ✓';
      stageComment = `Citizen community verified complete resolution (${complaint.verificationSummary.resolvedVotes} vote(s)). Issue permanently marked RESOLVED.`;
    } else if (complaint.verificationSummary.unresolvedVotes > 0) {
      updatedStatus = 'IN_PROGRESS';
      complaint.status = 'IN_PROGRESS';
      complaint.verificationSummary.status = 'CONTESTED';
      stageTitle = 'Citizen Verification: Issue Still Exists ✕';
      stageComment = `Citizen filed proof that issue remains unresolved. Ticket re-opened for field crew re-inspection.`;
    } else {
      stageTitle = 'Citizen Verification Recorded';
      stageComment = `Citizen recorded feedback: ${result.replace(/_/g, ' ')}.`;
    }

    await complaint.save();

    // Add timeline record
    await StatusHistory.create({
      complaintId: complaint._id,
      status: updatedStatus,
      stageTitle,
      comment: stageComment,
      icon: result === 'RESOLVED' ? 'CheckCheck' : 'AlertTriangle',
      updatedBy: req.user ? req.user._id : null,
      updaterName: req.user ? req.user.name : 'Citizen Contributor',
    });

    // Reward points to citizen
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { points: 5 },
        $addToSet: {
          badges: {
            id: 'community-helper',
            name: 'Community Helper',
            icon: '🤝',
            description: 'Verified a civic resolution to ensure municipal accountability.',
            awardedAt: new Date()
          }
        }
      });

      await Notification.create({
        userId: req.user._id,
        complaintId: complaint._id,
        title: 'Points Earned: +5 Civic Points!',
        message: `Thank you for inspecting and verifying resolution on "${complaint.title}". Your input keeps city authorities accountable.`,
        type: 'POINTS_AWARDED',
      });
    }

    res.status(201).json({
      message: 'Verification recorded successfully',
      verification,
      updatedComplaintStatus: complaint.status,
      verificationSummary: complaint.verificationSummary,
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Error submitting verification', error: error.message });
  }
};

module.exports = {
  submitVerification,
};
