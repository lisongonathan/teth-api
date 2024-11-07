const UserController = require('./UserController');
const FinanceModel = require('../models/FinanceModel');

class FinanceController extends UserController{
    constructor() {
        super();

        this.financeModel = new FinanceModel();
    }
    async graphique(req, res) {
        try {
            // Récupérer tous les jetons
            const rowJetons = await this.financeModel.getAllJetons();
    
            if (!rowJetons?.data.length) {
                return res.status(404).json({ status: 404, message: "Aucun jeton trouvé" });
            }
    
            // Initialiser un tableau pour stocker les ventes mensuelles par jeton
            let ventesParMois = rowJetons.data.map(jeton => {
                return {
                    variable: jeton.designation,  // Nom du jeton
                    distribution: Array(12).fill(0)  // Initialiser les ventes de chaque mois à 0
                };
            });
    
            // Récupérer les ventes mensuelles pour chaque jeton
            const rowVentes = await this.financeModel.getVentesJetonsMensuelles();
    
            // Mapper les ventes mensuelles aux bons jetons et mois
            if (rowVentes?.data.length) {
                rowVentes.data.forEach(row => {
                    // Trouver le jeton correspondant
                    const jetonIndex = ventesParMois.findIndex(jeton => jeton.variable === row.jeton_designation);
    
                    if (jetonIndex !== -1) {
                        const monthIndex = row.month - 1;  // Mois de 1 à 12, on ajuste pour l'index 0 à 11
                        ventesParMois[jetonIndex].distribution[monthIndex] = row.ventes;
                    }
                });
            }
    
            // Retourner les résultats structurés avec les mois et les ventes par jeton
            return res.status(200).json({
                status: 200,
                msg: "Succès",
                data: {
                    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],  // Mois de l'année
                    ...ventesParMois  // Ventes par jeton et mois
                }
            });
    
        } catch (error) {
            console.error("Erreur lors de la récupération des données : ", error);
            return res.status(500).json({ status: 500, message: "Erreur serveur", error });
        }
    }
    
    

}

module.exports = FinanceController