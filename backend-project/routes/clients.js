const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { checkAuth } = require('../middleware/auth');

router.post('/', checkAuth, clientController.createClient);
router.get('/', checkAuth, clientController.getAllClients);
router.get('/:id', checkAuth, clientController.getClientById);
router.put('/:id', checkAuth, clientController.updateClient);
router.delete('/:id', checkAuth, clientController.deleteClient);

module.exports = router;
