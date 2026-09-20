const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getNotifications);
router.patch('/:id/read', optionalAuth, markAsRead);

module.exports = router;
