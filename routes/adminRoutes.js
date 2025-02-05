const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController');
const adminController = new AdminController();

router.get('/', (req, res) => adminController.statistique(req, res));
router.post('/metrique', (req, res) => adminController.metrique(req, res));
router.post('/camembert', (req, res) => adminController.camembert(req, res));

module.exports = router;