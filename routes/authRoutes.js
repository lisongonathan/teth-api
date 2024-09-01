// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Route pour récupérer tous les utilisateurs
router.post('/', AuthController.login);

module.exports = router;
