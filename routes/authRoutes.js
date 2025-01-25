// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

const authController = new AuthController()
// Route pour récupérer tous les utilisateurs
router.post('/', (req, res) => authController.login(req, res));
router.post('/forget', (req, res) => authController.forget(req, res));

module.exports = router;
