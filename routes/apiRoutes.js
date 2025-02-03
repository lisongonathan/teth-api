// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const AppController = require('../controllers/AppController');
const QuestionController = require('../controllers/QuestionController');

const authController = new AuthController();
const appController = new AppController();
const questionController = new QuestionController();

// Route pour récupérer tous les utilisateurs
router.post('/', (req, res) => authController.signin(req, res));
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await AppModel.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/register', (req, res) => authController.signup(req, res));
router.post('/recovery', (req, res) => authController.recovery(req, res));
router.get('/jetons', (req, res) => appController.allTokens(req, res));
router.post('/buyToken', (req, res) => appController.buyToken(req, res));
router.get('/cagnote', (req, res) => appController.checkCagnote(req, res))
router.get('/categories', (req, res) => questionController.categories(req, res));
router.post('/categories', (req, res) => appController.jeu(req, res));
router.post('/resultat', (req, res) => appController.resultJeu(req, res));

module.exports = router;
