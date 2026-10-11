const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { checkAuth } = require('../middleware/auth');

router.post('/', checkAuth, bookingController.createBooking);
router.get('/', checkAuth, bookingController.getAllBookings);
router.get('/:id', checkAuth, bookingController.getBookingById);
router.put('/:id', checkAuth, bookingController.updateBooking);
router.delete('/:id', checkAuth, bookingController.deleteBooking);

module.exports = router;
