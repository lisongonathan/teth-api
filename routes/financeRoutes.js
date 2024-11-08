const express = require('express');
const router = express.Router();

const FinanceController = require('../controllers/FinanceController');
const financeController = new FinanceController();

router.post('/', (req, res) => financeController.graphique(req, res));
router.post('/metrique', (req, res) => financeController.metrique(req, res));
router.post('/camembert', (req, res) => financeController.camembert(req, res));

module.exports = router;