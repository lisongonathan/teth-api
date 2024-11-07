const UserController = require('./UserController');
const QuestionModel = require('../models/QuestionModel');

class QuestionController extends UserController {
    constructor() {
        super()

        this.questionModel = new QuestionModel();
    }

    async graphique(req, res) {
        
    }
}