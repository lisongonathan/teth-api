const UserController = require('./UserController');
const QuestionModel = require('../models/QuestionModel');

class QuestionController extends UserController {
    constructor() {
        super()

        this.questionModel = new QuestionModel();
    }

    async graphique(req, res) {
        try {
            // Initialiser les mois et les volumes par défaut
            const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            let questionsReussies = Array(12).fill(0);  // Valeurs par défaut de 0 pour chaque mois
            let questionsEchouees = Array(12).fill(0);  // Valeurs par défaut de 0 pour chaque mois
    
            // Récupérer le volume des questions réussies par mois
            const rowQuestionsReussies = await this.questionModel.getQuestionsOkByMonth();
    
            // Mapper les résultats des questions réussies
            if (rowQuestionsReussies?.data.length) {
                rowQuestionsReussies.data.forEach(row => {
                    const monthIndex = row.month - 1;  // Ajuster l'index du mois (0 à 11)
                    questionsReussies[monthIndex] = row.questions_reussies;
                });
            }
    
            // Récupérer le volume des questions échouées par mois
            const rowQuestionsEchouees = await this.questionModel.getQuestionsNoByMonth();
    
            // Mapper les résultats des questions échouées
            if (rowQuestionsEchouees?.data.length) {
                rowQuestionsEchouees.data.forEach(row => {
                    const monthIndex = row.month - 1;  // Ajuster l'index du mois (0 à 11)
                    questionsEchouees[monthIndex] = row.questions_echouees;
                });
            }
    
            // Retourner les résultats au format attendu pour le graphique
            return res.status(200).json({
                status: 200,
                msg: "Succès",
                data: {
                    months,
                    0:{
                        variable: "Questions Validées",
                        distribution: [...questionsReussies]
                    },
                    1:{
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
    
}

module.exports = QuestionController