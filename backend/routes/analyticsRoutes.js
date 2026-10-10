const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getAnalytics } = require('../controller/analyticsController.js');

const router = express.Router();

router.route('/').get(protect, admin, getAnalytics);

module.exports = router;