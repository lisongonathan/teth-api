const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/QuestionController');
const authMiddleware = require('../middleware/authMiddleware');

const questionController = new QuestionController();

// Protéger les routes avec le middleware d'authentification
router.use(authMiddleware);

router.get('/', (req, res) => questionController.statistique(req, res));
router.get('/graphique', (req, res) => questionController.graphique(req, res));
router.get('/metrique', (req, res) => questionController.metrique(req, res));
router.get('/categories', (req, res) => questionController.categories(req, res));
router.post('/categories', (req, res) => questionController.addCategory(req, res));
router.put('/categories', (req, res) => questionController.updateCategory(req, res));
router.delete('/categories', (req, res) => questionController.deleteCategory(req, res));
router.get('/questions', (req, res) => questionController.questions(req, res));
router.post('/questions', (req, res) => questionController.addQuestion(req, res));
router.put('/questions', (req, res) => questionController.updateQuestion(req, res));
router.delete('/questions', (req, res) => questionController.deleteQuestion(req, res));

module.exports = router;