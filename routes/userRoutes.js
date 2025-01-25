// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

const userController = new UserController();

// Protéger les routes avec le middleware d'authentification
router.use(authMiddleware);

router.get('/cagnote', (req, res) => userController.cagnote(req, res));
router.get('/parties', (req, res) => userController.parties(req, res));
router.get('/users', (req, res) => userController.users(req, res));

module.exports = router;
