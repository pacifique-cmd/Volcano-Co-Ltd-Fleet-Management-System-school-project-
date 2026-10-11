const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { checkAuth } = require('../middleware/auth');

router.get('/monthly', checkAuth, reportController.getMonthlyBookingReport);
router.get('/date-range', checkAuth, reportController.getBookingsByDateRange);
router.get('/performance', checkAuth, reportController.getFleetPerformanceReport);

module.exports = router;
