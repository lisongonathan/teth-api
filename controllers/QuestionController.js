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

    async metrique(req, res) {
        try {
            // 1. Total Catégorie
            const totalCategoriesResult = await this.execute(`SELECT COUNT(*) AS totalCategories FROM categorie`);
            const totalCategories = totalCategoriesResult[0]?.totalCategories || 0;
    
            // 2. Taux moyen de réussites par catégorie
            const tauxReussiteCategorieResult = await this.execute(`
                SELECT categorie.id, AVG(CASE WHEN jeu.statut = 'OK' THEN 1 ELSE 0 END) * 100 AS tauxReussite
                FROM categorie
                LEFT JOIN question ON question.id_categorie = categorie.id
                LEFT JOIN jeu ON jeu.id_question = question.id
                GROUP BY categorie.id
            `);
            const tauxReussiteCategorie = tauxReussiteCategorieResult.map(row => ({
                categorie_id: row.id,
                tauxReussite: row.tauxReussite || 0
            }));
    
            // 3. Total Question
            const totalQuestionsResult = await this.execute(`SELECT COUNT(*) AS totalQuestions FROM question`);
            const totalQuestions = totalQuestionsResult[0]?.totalQuestions || 0;
    
            // 4. Durée moyenne de question
            const dureeMoyenneQuestionResult = await this.execute(`SELECT AVG(duree) AS dureeMoyenne FROM question`);
            const dureeMoyenneQuestion = dureeMoyenneQuestionResult[0]?.dureeMoyenne || 0;
    
            // 5. Total Questions échouées
            const totalQuestionsEchoueesResult = await this.execute(`
                SELECT COUNT(*) AS totalQuestionsEchouees 
                FROM jeu 
                WHERE statut = 'NO'
            `);
            const totalQuestionsEchouees = totalQuestionsEchoueesResult[0]?.totalQuestionsEchouees || 0;
    
            // 6. Moyenne des questions par niveau
            const moyenneQuestionsParNiveauResult = await this.execute(`
                SELECT type, COUNT(*) / COUNT(DISTINCT id) AS moyenneQuestionsParNiveau
                FROM question
                GROUP BY type
            `);
            const moyenneQuestionsParNiveau = moyenneQuestionsParNiveauResult.map(row => ({
                niveau: row.type,
                moyenneQuestions: row.moyenneQuestionsParNiveau || 0
            }));
    
            // 7. Total Questions réussies
            const totalQuestionsReussitesResult = await this.execute(`
                SELECT COUNT(*) AS totalQuestionsReussites 
                FROM jeu 
                WHERE statut = 'OK'
            `);
            const totalQuestionsReussites = totalQuestionsReussitesResult[0]?.totalQuestionsReussites || 0;
    
            // 8. Fréquence moyenne d'apparition des questions
            const frequenceMoyenneApparitionResult = await this.execute(`
                SELECT COUNT(*) / COUNT(DISTINCT id_question) AS frequenceMoyenneApparition
                FROM jeu
            `);
            const frequenceMoyenneApparition = frequenceMoyenneApparitionResult[0]?.frequenceMoyenneApparition || 0;
    
            // Rassembler tous les résultats
            return res.status(200).json({
                status: 200,
                msg: "Succès",
                data: {
                    totalCategories,
                    tauxReussiteCategorie,
                    totalQuestions,
                    dureeMoyenneQuestion,
                    totalQuestionsEchouees,
                    moyenneQuestionsParNiveau,
                    totalQuestionsReussites,
                    frequenceMoyenneApparition
                }
            });
    
        } catch (error) {
            console.error("Erreur lors de la récupération des métriques : ", error);
            return res.status(500).json({ status: 500, message: "Erreur serveur", error });
        }
    }
    
}

module.exports = QuestionController