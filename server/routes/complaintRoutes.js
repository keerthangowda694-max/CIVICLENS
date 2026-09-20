const express = require('express');
const router = express.Router();
const {
  previewAI,
  createComplaint,
  getComplaints,
  getComplaintById,
  updateDepartment,
  updateStatus,
} = require('../controllers/complaintController');
const { optionalAuth, authenticate, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/preview-ai', upload.single('image'), previewAI);
router.post('/', optionalAuth, upload.array('images', 5), createComplaint);
router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.patch('/:id/department', optionalAuth, updateDepartment);
router.patch('/:id/status', optionalAuth, upload.single('resolutionImage'), updateStatus);

module.exports = router;
