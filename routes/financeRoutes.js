const express = require('express');
const router = express.Router();

const FinanceController = require('../controllers/FinanceController');
const financeController = new FinanceController();

router.post('/', (req, res) => financeController.graphique(req, res));

module.exports = router;