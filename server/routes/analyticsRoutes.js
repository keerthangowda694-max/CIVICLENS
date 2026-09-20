const express = require('express');
const router = express.Router();
const { getAnalytics, getAreaOverview } = require('../controllers/analyticsController');

router.get('/', getAnalytics);
router.get('/area-overview', getAreaOverview);

module.exports = router;
