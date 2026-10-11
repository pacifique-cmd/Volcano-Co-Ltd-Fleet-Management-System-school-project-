const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { checkAuth } = require('../middleware/auth');

router.post('/', checkAuth, vehicleController.createVehicle);
router.get('/', checkAuth, vehicleController.getAllVehicles);
router.get('/available', checkAuth, vehicleController.getAvailableVehicles);
router.get('/:id', checkAuth, vehicleController.getVehicleById);
router.put('/:id', checkAuth, vehicleController.updateVehicle);
router.delete('/:id', checkAuth, vehicleController.deleteVehicle);

module.exports = router;
