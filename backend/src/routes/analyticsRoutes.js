const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Updated to match the correct function name
router.get('/overview', authMiddleware, analyticsController.getAnalyticsOverview);

module.exports = router;
