// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

const authController = new AuthController()
// Route pour récupérer tous les utilisateurs
router.get('/', (req, res) => authController.splash(req, res));
router.get('/logo', (req, res) => authController.logo(req, res));
router.get('/rules', (req, res) => authController.rules(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/recovery', (req, res) => authController.sendPassword(req, res));
router.post('/register', (req, res) => authController.register(req, res));
router.post('/forgot', (req, res) => authController.forgot(req, res));

module.exports = router;
