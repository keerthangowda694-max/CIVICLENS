const express = require('express');
const router = express.Router();
const { getClusters, getClusterById } = require('../controllers/clusterController');

router.get('/', getClusters);
router.get('/:id', getClusterById);

module.exports = router;
