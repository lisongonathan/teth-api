const FinanceController = require('./FinanceController');
const AdminModel = require('../models/AdminModel');

class AdminController extends FinanceController {
    constructor() {
        super()

        this.adminModel = new AdminModel();
    }

    async graphique(req, res) {
        // Initialisation des mois et des valeurs par défaut
        const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let recettes = Array(12).fill(0);  // Valeurs par défaut de 0 pour chaque mois
        let depenses = Array(12).fill(0);  // Valeurs par défaut de 0 pour chaque mois
    
        try {
            // Récupérer les données de recettes et de dépenses
            const rowRecettes = await this.adminModel.getRecettesByMonths();
            const rowDepenses = await this.adminModel.getDepensesByMonths();
    
            // Mapper les données de recettes pour les affecter au bon mois
            if (rowRecettes?.data.length) {
                rowRecettes.data.forEach(row => {
                    const monthIndex = row.month - 1;  // Index du mois (0 pour janvier, etc.)
                    recettes[monthIndex] = row.value;
                });
            }
    
            // Mapper les données de dépenses pour les affecter au bon mois
            if (rowDepenses?.data.length) {
                rowDepenses.data.forEach(row => {
                    const monthIndex = row.month - 1;  // Index du mois (0 pour janvier, etc.)
                    depenses[monthIndex] = row.value;
                });
            }
            // Retourner les données formatées
            return res.status(200).json({
                status: 200,
                msg: "Succès",
                data: {
                    months,
                    0: {
                        variable : "Recettes",
                        distribution: [...recettes]
                    },
                    1: {
                        variable: "Dépenses",
                        distribution: [...depenses]
                    }
                }
            });
    
        } catch (error) {
            console.error("Erreur lors de la récupération des données : ", error);
            return res.status(500).json({ status: 500, msg: "Erreur serveur", error });
        }
    }
    
    
}

module.exports = AdminController;