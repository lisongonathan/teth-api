const AuthController = require('./AuthController');
const QuestionModel = require('../models/QuestionModel');

class QuestionController extends AuthController {
  constructor() {
    super();
    this.questionModel = new QuestionModel();
  }

  async statistique(req, res) {
    try {
      const listChoices = [
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

  async graphique(req, res) {
    try {
      const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      let questionsReussies = Array(12).fill(0);
      let questionsEchouees = Array(12).fill(0);

      const rowQuestionsReussies = await this.questionModel.getQuestionsOkByMonth();
      if (rowQuestionsReussies?.data.length) {
        rowQuestionsReussies.data.forEach(row => {
          const monthIndex = row.month - 1;
          questionsReussies[monthIndex] = row.questions_reussies;
        });
      }

      const rowQuestionsEchouees = await this.questionModel.getQuestionsNoByMonth();
      if (rowQuestionsEchouees?.data.length) {
        rowQuestionsEchouees.data.forEach(row => {
          const monthIndex = row.month - 1;
          questionsEchouees[monthIndex] = row.questions_echouees;
        });
      }

      return res.status(200).json({
        status: 200,
        msg: "Succès",
        data: {
          months,
          0: {
            variable: "Questions Validées",
            distribution: [...questionsReussies]
          },
          1: {
            variable: "Questions non validées",
            distribution: [...questionsEchouees]
          }
        }
      });

    } catch (error) {
      console.error("Erreur lors de la récupération des données : ", error);
      return res.status(500).json({ status: 500, message: "Erreur serveur", error });
    }
  }

  async metrique(req, res) {
    let categories = {
      var_1: "Catégories",
      effe_1: 0,
      var_2: "Questions/Catégorie",
      effe_2: 0,
      icone: "pi-filter-fill"
    };

    let questions = {
      var_1: "Questions",
      effe_1: 0,
      var_2: "Occurrences questions",
      effe_2: 0,
      icone: "pi-question"
    };

    let niveaux = {
      var_1: "Niveaux",
      effe_1: 0,
      var_2: "Joeurs/Niveau",
      effe_2: 0,
      icone: "pi-sitemap"
    }

    let performances = {
      var_1: "Questions validées",
      effe_1: 0,
      var_2: "Questions non validées",
      effe_2: 0,
      icone: "pi-verified"
    }
    try {
      const rowsCategories = await this.questionModel.getAllCategories();
      if (rowsCategories?.data.length) categories.effe_1 = rowsCategories.data.length;

      const rowsQuestions = await this.questionModel.getAllQuestions();
      if (rowsQuestions?.data.length) {
        questions.effe_1 = rowsQuestions.data.length;
        categories.effe_2 = questions.effe_1 / categories.effe_1;
      }

      const rowsOccures = await this.questionModel.getOcuurQuestions();
      if (rowsOccures?.data.length) rowsOccures.data.map(occur => questions.effe_2 = occur.frequenceMoyenneApparition || 0);

      const rowsNiveaux = await this.questionModel.getAllNiveaux();
      if (rowsNiveaux?.data.length) niveaux.effe_1 = rowsNiveaux.data.length;

      const rowsClients = await this.questionModel.getAllUsers();
      if (rowsClients?.data.length) niveaux.effe_2 = rowsClients.data.length / niveaux.effe_1;

      const rowsQuestionsOk = await this.questionModel.getQuestionsOk();
      questions.effe_1 = rowsQuestionsOk?.data.length;

      const rowsQuestionsNo = await this.questionModel.getQuestionsNo();
      questions.effe_2 = rowsQuestionsNo?.data.length;

      categories.effe_1 = `Total ${categories.effe_1}`;
      categories.effe_2 = `Moyenne ${categories.effe_2}`;
      questions.effe_1 = `Total ${questions.effe_1}`;
      questions.effe_2 = `Moyenne ${questions.effe_2}`;
      niveaux.effe_1 = `Total ${niveaux.effe_1}`;
      niveaux.effe_2 = `Moyenne ${niveaux.effe_2}`;

      return res.status(200).json({
        status: 200,
        msg: "Succès",
        data: [
          categories,
          questions,
          niveaux,
          performances
        ]
      })
    } catch (error) {
      console.error("Erreur lors de la récupération des métriques : ", error);
      return res.status(500).json({ status: 500, message: "Erreur serveur", error });
    }
  }
}

module.exports = QuestionController;