const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { checkAuth } = require('../middleware/auth');

router.post('/', checkAuth, driverController.createDriver);
router.get('/', checkAuth, driverController.getAllDrivers);
router.get('/:id', checkAuth, driverController.getDriverById);
router.put('/:id', checkAuth, driverController.updateDriver);
router.delete('/:id', checkAuth, driverController.deleteDriver);

module.exports = router;
