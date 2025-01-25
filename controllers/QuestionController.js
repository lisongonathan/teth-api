const AuthController = require('./AuthController');
const QuestionModel = require('../models/QuestionModel');

class QuestionController extends AuthController {
  constructor() {
    super();
    this.questionModel = new QuestionModel();
  }

  async statistique(req, res) {
    try {
      let listChoices = [
        { id: 1, title: 'choix_1', metrique: [] },
        { id: 2, title: 'choix_2', metrique: [] },
        { id: 3, title: 'choix_3', metrique: [] },
        { id: 4, title: 'choix_4', metrique: [] }
      ];

      return res.json({ status: 200, message: 'Statistiques récupérées avec succès', data: listChoices });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }
  
  filterQuestionsByAssertion(assertionId, questions) {
    return questions.filter(question => question.reponse === assertionId);
  }

  filterQuestionsByCategory(categoryId, questions) {
    return questions.filter(question => question.id_categorie === categoryId);
  }
}

module.exports = QuestionController;