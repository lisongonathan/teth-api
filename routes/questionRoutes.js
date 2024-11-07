const express = require('express');
const router = express.Router();

const QuestionController = require('../controllers/QuestionController');
const questionController = new QuestionController();

router.post('/', (req, res) => questionController.graphique(req, res));

module.exports = router;