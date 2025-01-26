const AuthController = require('./AuthController');
const QuestionModel = require('../models/QuestionModel');
const UserModel = require('../models/UserModel');

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

      const categories = await this.questionModel.getAllCategories();
      const questions = await this.questionModel.getAllQuestions();

      if (categories?.data.length && questions?.data.length) {
        listChoices.forEach(choice => {
          let listCategories = [];

          categories.data.forEach(category => {
            const questionsInCategory = questions.data.filter(q => q.id_categorie === category.id);
            const questionsWithAssertion = questionsInCategory.filter(q => q.reponse === choice.id);
            const proportion = (questionsWithAssertion.length * 100 / questions.data.length).toFixed(2);

            listCategories.push({
              modalite: category.designation,
              effectif: questionsWithAssertion.length,
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

  async categories(req, res) {
    try {
      const categories = await this.questionModel.getAllCategories();
      return res.json({ status: 200, message: 'Catégories récupérées avec succès', data: categories.data });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async addCategory(req, res) {
    const { designation, description } = req.body;
    try {
      const newCategory = await this.questionModel.addCategory(designation, description);
      return res.json({ status: 201, message: 'Catégorie ajoutée avec succès', data: newCategory });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async updateCategory(req, res) {
    const { id, designation, description } = req.body;
    try {
      const updatedCategory = await this.questionModel.updateCategory(id, designation, description);
      return res.json({ status: 200, message: 'Catégorie mise à jour avec succès', data: updatedCategory });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async deleteCategory(req, res) {
    const { id } = req.body;
    try {
      await this.questionModel.deleteCategory(id);
      return res.json({ status: 200, message: 'Catégorie supprimée avec succès' });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async questions(req, res) {
    try {
      const categories = await this.questionModel.getAllCategories();
      const questions = await this.questionModel.getAllQuestions();

      let response = [];

      if (categories?.data.length && questions?.data.length) {
        response = categories.data.map(category => {
          const questionsInCategory = questions.data.filter(q => q.id_categorie === category.id);
          
          return {
            id: category.id,
            designation: category.designation,
            question: questionsInCategory.map(q => ({
              id: q.id,
              enonce: q.enonce,
              duree_sec: q.duree_sec,
              id_categorie: q.id_categorie,
              choix_1: q.choix_1,
              choix_2: q.choix_2,
              choix_3: q.choix_3,
              choix_4: q.choix_4,
              reponse: q.reponse,
              statut: q.statut,
              id_agent: q.id_agent
            }))
          };
        });
      }

      return res.json({ status: 200, message: 'Questions récupérées avec succès', data: response });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async addQuestion(req, res) {
    const { enonce, duree_sec, id_categorie, choix_1, choix_2, choix_3, choix_4, reponse, id_agent } = req.body;
    try {
      const newQuestion = await this.questionModel.addQuestion(enonce, duree_sec, id_categorie, choix_1, choix_2, choix_3, choix_4, reponse, id_agent);
      return res.json({ status: 201, message: 'Question ajoutée avec succès', data: newQuestion });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async updateQuestion(req, res) {
    const { id, enonce, duree_sec, id_categorie, choix_1, choix_2, choix_3, choix_4, reponse, statut, id_agent } = req.body;
    try {
      const updatedQuestion = await this.questionModel.updateQuestion(id, enonce, duree_sec, id_categorie, choix_1, choix_2, choix_3, choix_4, reponse, statut, id_agent);
      return res.json({ status: 200, message: 'Question mise à jour avec succès', data: updatedQuestion });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async deleteQuestion(req, res) {
    const { id } = req.body;
    try {
      await this.questionModel.deleteQuestion(id);
      return res.json({ status: 200, message: 'Question supprimée avec succès' });
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