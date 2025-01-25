// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const userController = new UserController();

// Route pour récupérer tous les utilisateurs
router.get('/cagnote', (req, res) => userController.cagnote(req, res));
router.get('/parties', (req, res) => userController.parties(req, res));
router.get('/users', (req, res) => userController.users(req, res));

module.exports = router;
