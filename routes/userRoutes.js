// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const userController = new UserController();

// Route pour récupérer tous les utilisateurs
router.get('/', (req, res) => userController.agents(req, res));
router.get('/logo', (req, res) => userController.logo(req, res));
router.get('/rules', (req, res) => userController.rules(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.post('/recovery', (req, res) => userController.sendPassword(req, res));
router.post('/register', (req, res) => userController.register(req, res));

router.post('/sessions', (req, res) => userController.sessions(req, res));

module.exports = router;
