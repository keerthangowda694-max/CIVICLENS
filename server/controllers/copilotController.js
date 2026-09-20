const Complaint = require('../models/Complaint');
const IssueCluster = require('../models/IssueCluster');
const aiService = require('../services/aiService');

const askCopilot = async (req, res) => {
  try {
    const { question, currentIssueId } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Gather real-time context from MongoDB
    const totalIssues = await Complaint.countDocuments();
    const activeIssues = await Complaint.countDocuments({ status: { $ne: 'RESOLVED' } });
    const resolvedIssues = await Complaint.countDocuments({ status: 'RESOLVED' });
    const highImpactIssues = await Complaint.countDocuments({ priorityScore: { $gte: 70 } });

    const complaints = await Complaint.find()
      .sort({ priorityScore: -1 })
      .limit(10)
      .select('title location category priorityScore severity status summary duplicateGroupId');

    // Aggregate category distribution
    const catAgg = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categories = catAgg.map(c => ({ name: c._id, count: c.count }));

    const contextData = {
      totalIssues,
      activeIssues,
      resolvedIssues,
      highImpactIssues,
      categories,
      complaints,
    };

    // If referring to a specific issue:
    if (currentIssueId) {
      const specificIssue = await Complaint.findById(currentIssueId).populate('duplicateGroupId');
      if (specificIssue) {
        contextData.currentIssue = specificIssue;
      }
    }

    const copilotReply = await aiService.answerCopilotQuery(question, contextData);

    res.json({
      question,
      ...copilotReply,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Copilot error:', error);
    res.status(500).json({ message: 'Error querying Civic Copilot', error: error.message });
  }
};

module.exports = {
  askCopilot,
};
