const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/QuestionController');
const authMiddleware = require('../middleware/authMiddleware');

const questionController = new QuestionController();

// Protéger les routes avec le middleware d'authentification
router.use(authMiddleware);

router.post('/', (req, res) => questionController.graphique(req, res));
router.get('/metrique', (req, res) => questionController.metrique(req, res));
router.post('/metrique', (req, res) => questionController.metrique(req, res));
router.get('/statistique', (req, res) => questionController.statistique(req, res));

module.exports = router;