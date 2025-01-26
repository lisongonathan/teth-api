const express = require('express');
const router = express.Router();

const FinanceController = require('../controllers/FinanceController');
const authMiddleware = require('../middleware/authMiddleware');

const financeController = new FinanceController();

// Protéger les routes avec le middleware d'authentification
router.use(authMiddleware);

router.post('/', (req, res) => financeController.graphique(req, res));
router.post('/metrique', (req, res) => financeController.metrique(req, res));
router.post('/camembert', (req, res) => financeController.camembert(req, res));
router.get('/statistique', (req, res) => financeController.statistique(req, res));

module.exports = router;