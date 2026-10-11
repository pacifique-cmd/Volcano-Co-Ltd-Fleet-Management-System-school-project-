const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { checkAuth } = require('../middleware/auth');

router.post('/', checkAuth, maintenanceController.createMaintenance);
router.get('/', checkAuth, maintenanceController.getAllMaintenance);
router.get('/:id', checkAuth, maintenanceController.getMaintenanceById);
router.get('/vehicle/:vehicleID', checkAuth, maintenanceController.getMaintenanceByVehicle);
router.put('/:id', checkAuth, maintenanceController.updateMaintenance);
router.delete('/:id', checkAuth, maintenanceController.deleteMaintenance);

module.exports = router;
