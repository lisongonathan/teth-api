const AuthController = require('./AuthController');
const QuestionModel = require('../models/QuestionModel');
const UserModel = require('../models/UserModel');

class QuestionController extends AuthController {
  constructor() {
    super();
    this.questionModel = new QuestionModel();
    this.userModel = new UserModel();
  }

  async statistique(req, res) {
    try {
      let listChoices = [
        { id: 1, title: 'choix_1', metrique: [] },
        { id: 2, title: 'choix_2', metrique: [] },
        { id: 3, title: 'choix_3', metrique: [] },
        { id: 4, title: 'choix_4', metrique: [] }
      ];

      const categories = await this.userModel.getAllCategories();
      const questions = await this.userModel.getAllQuestions();

      if (categories?.data.length && questions?.data.length) {
        listChoices.forEach(choice => {
          let listCategories = [];

          categories.data.forEach(category => {
            const questionsInCategory = questions.data.filter(q => q.id_categorie === category.id);
            const questionsWithAssertion = questionsInCategory.filter(q => q.reponse === choice.id);
            const proportion = (questionsWithAssertion.length * 100 / questions.data.length).toFixed(2);

            listCategories.push({
              categorie: category.designation,
              question: questionsWithAssertion.length,
              proportion: proportion
            });
          });

          choice.metrique = listCategories;
        });
      }

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