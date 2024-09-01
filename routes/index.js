// routes/index.js
const express = require('express');
const router = express.Router();

// Importer les routes individuelles
const authRoutes = require('./authRoutes');
// const userRoutes = require('./userRoutes');
// const chatRoutes = require('./chatRoutes');
// const messageRoutes = require('./messageRoutes');
// const accountRoutes = require('./accountRoutes');

// Utiliser les routes avec leurs préfixes respectifs
router.use('/auth', authRoutes);
// router.use('/user', userRoutes);
// router.use('/chat', chatRoutes);
// router.use('/message', messageRoutes);
// router.use('/account', accountRoutes);

module.exports = router;