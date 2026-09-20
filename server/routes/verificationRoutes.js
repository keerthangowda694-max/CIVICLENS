const express = require('express');
const router = express.Router();
const { submitVerification } = require('../controllers/verificationController');
const { optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/:complaintId', optionalAuth, upload.single('image'), submitVerification);

module.exports = router;
