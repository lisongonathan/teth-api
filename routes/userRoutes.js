// routes/authRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

const userController = new UserController();
const upload = multer();

// Protéger les routes avec le middleware d'authentification
router.use(authMiddleware);

router.get('/cagnote', (req, res) => userController.cagnote(req, res));
router.get('/parties', (req, res) => userController.parties(req, res));
router.get('/users', (req, res) => userController.users(req, res));
router.get('/', (req, res) => userController.metrique(req, res));
router.post('/avatar', upload.single('photo'), (req, res) => userController.avatar(req, res));
router.put('/profile', (req, res) => userController.updateProfile(req, res));
router.put('/password', (req, res) => userController.changePassword(req, res));

module.exports = router;
