const IssueCluster = require('../models/IssueCluster');
const Complaint = require('../models/Complaint');

const getClusters = async (req, res) => {
  try {
    const clusters = await IssueCluster.find()
      .populate('complaintIds', 'title location priorityScore severity status images createdAt')
      .sort({ impactScore: -1 });

    res.json({ count: clusters.length, clusters });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clusters', error: error.message });
  }
};

const getClusterById = async (req, res) => {
  try {
    const cluster = await IssueCluster.findById(req.params.id)
      .populate('complaintIds')
      .populate('leadComplaintId');

    if (!cluster) {
      return res.status(404).json({ message: 'Cluster not found' });
    }

    res.json({ cluster });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cluster details', error: error.message });
  }
};

module.exports = {
  getClusters,
  getClusterById,
};
