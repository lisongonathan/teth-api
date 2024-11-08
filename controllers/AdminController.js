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
    
    async metrique (req, res) {
        let recettes = {
            var_1: "Solde recettes",
            effe_1: 0,
            var_2: "Parties perdues",
            effe_2: 0,
            icone: "pi-credit-card"
        };

        let depenses = {
            var_1: "Solde dépenses",
            effe_1: 0,
            var_2: "Parties gagnées",
            effe_2: 0,
            icone: "pi-shopping-cart"
        };

        let users = {
            var_1: "Utilisateurs",
            effe_1: 0,
            var_2: "Derniers connectées",
            effe_2: 0,
            icone: "pi-users"
        }

        let caisse = {
            var_1: "Somme à rebours",
            effe_1: 0,
            var_2: "Parties",
            effe_2: 0,
            icone: "pi-wallet"
        }

        try {
            const rowUsers = await this.adminModel.getAllUsers();
            let lastConnected = 0;
        
            if (rowUsers?.data.length) {
                rowUsers.data.forEach(row => {
                    console.log("Current user ", row);

                    if(row.statut == "True") lastConnected += 1;

                })

                users.effe_1 = rowUsers.data.length;
                users.effe_2 = lastConnected;
            }

            const allPariesResult = await this.adminModel.getAllParties();

            allPariesResult.data.forEach((partie) => {
                caisse.effe_2 += 1;

                if (partie.statut == 'OK') {
                    depenses.effe_1 += 2000;
                    depenses.effe_2 += 1;
                } else {
                    recettes.effe_1 += 500;
                    recettes.effe_2 += 1;
                }
            })

            depenses.effe_1 = `${depenses.effe_1} CDF`;
            recettes.effe_1 = `${recettes.effe_1} CDF`;
            users.effe_1 = `${users.effe_1} inscrit(s)`

            const inforTransaction = await this.adminModel.getCapital();
            inforTransaction.data.map(row => caisse.effe_1 = `${row.total_debit - row.total_credit} CDF`);

            return res.status(200).json({
                status: 200,
                msg: "Succès",
                data: [
                    recettes,
                    depenses,
                    users,
                    caisse
                ]
            })
        } catch (error) {
            console.error("Erreur lors du traitement de la requête : ", error);
            return res.status(500).json({
                status: 500,
                msg: "Erreur serveur",
                error
            })
        }
    }
    
}

module.exports = AdminController;