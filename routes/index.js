// routes/index.js
const express = require('express');
const router = express.Router();

// Importer les routes individuelles
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const financeRoutes = require('./financeRoutes');
// const accountRoutes = require('./accountRoutes');

// Utiliser les routes avec leurs préfixes respectifs
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/finance', financeRoutes);
// router.use('/account', accountRoutes);

module.exports = router;