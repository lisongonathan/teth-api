// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const AppController = require('../controllers/AppController');

const authController = new AuthController()
const appController = new AppController()
// Route pour récupérer tous les utilisateurs
router.post('/', (req, res) => authController.signin(req, res));
router.post('/register', (req, res) => authController.signup(req, res));
router.post('/recovery', (req, res) => authController.recovery(req, res));
router.get('/jetons', (req, res) => appController.allTokens(req, res));
router.post('/buyToken', (req, res) => appController.buyToken(req, res));

module.exports = router;
