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
    
    async metrique (req, res) {
        let recettes = {
            var_1: "Solde ventes jetons",
            effe_1: 0,
            var_2: "Ventes",
            effe_2: 0,
            icone: "pi-credit-card"
        };

        let depenses = {
            var_1: "Solde retraits",
            effe_1: 0,
            var_2: "Retraits en attente",
            effe_2: 0,
            icone: "pi-shopping-cart"
        };

        let users = {
            var_1: "Jétons",
            effe_1: 0,
            var_2: "Points de ventes",
            effe_2: 0,
            icone: "pi-users"
        }

        let caisse = {
            var_1: "Solde Debit",
            effe_1: 0,
            var_2: "Solde Credit",
            effe_2: 0,
            icone: "pi-wallet"
        }

        try {
            const rowsJetons = await this.financeModel.getAllJetons();
        
            if (rowsJetons?.data.length) users.effe_1 = rowsJetons.data.length;

            users.effe_1 = `${users.effe_1}`;

            const rowsVendeurs = await this.financeModel.getAllVendeurs();

            if(rowsVendeurs?.data.length) users.effe_2 = rowsVendeurs.data.length;

            users.effe_2 = `${users.effe_2} Vendeurs`;

            const rowsVentes = await this.financeModel.getVentesJetons();

            if(rowsVentes?.data.length) {
                recettes.effe_2 = rowsVentes.data.length;

                rowsVentes.data.map(vente => {
                    if(vente.cmd_state == "OK") recettes.effe_1 += vente.qte * vente.montant;
                })
            }

            recettes.effe_1 = `${recettes.effe_1} CDF`;
            
            const inforTransaction = await this.financeModel.getCapital();
            inforTransaction.data.map(row => {
                caisse.effe_1 = `${row.total_debit} CDF`;
                caisse.effe_2 = `${row.total_credit} CDF`;
            });

            const retraitsInfos = await this.financeModel.getAllRetraits();
            if(retraitsInfos?.data.length) {
                retraitsInfos.data.map(retrait =>{
                    if(retrait.statut == "OK"){
                        depenses.effe_1 += retrait.montant;
                    } else {
                        depenses.effe_2 += 1
                    }
                    
                })
            }

            depenses.effe_1 = `${depenses.effe_1} CDF`;
            // recettes.effe_1 = `${recettes.effe_1} CDF`;
            // users.effe_1 = `${users.effe_1} inscrit(s)`

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

    async camembert (req, res) {
        let distribution = {variable : "Ventes des Jetons", population : 0};
        let output = [];

        try {
            const rowVentes = await this.financeModel.getVentesByJeton();
        
            if (rowVentes?.data.length) {
                distribution.population = rowVentes.data.length;
                output.push(distribution);

                rowVentes.data.forEach(row => {
                                  
                    output.push({
                        modalite: row.modalite,
                        effectif: row.effectif
                    });
                })

            }
            return res.status(200).json({
                status: 200,
                msg: "Succès",
                data: output
            });

        } catch (error) {
            console.error("Erreur lors du traitement de la requête : ", error);

            return res.status(500).json({
                status: 500,
                msg: "Erreur serveur",
                error
            });
        }
        
    }

}

module.exports = FinanceController