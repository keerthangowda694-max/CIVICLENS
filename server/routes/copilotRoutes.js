const express = require('express');
const router = express.Router();
const { askCopilot } = require('../controllers/copilotController');

router.post('/ask', askCopilot);

module.exports = router;
