const FinanceController = require('./FinanceController');
const AdminModel = require('../models/AdminModel');
const AuthController = require('./AuthController');

class AdminController extends AuthController {
    constructor() {
        super()

        this.adminModel = new AdminModel();
    }

    async statistique(req, res) {
        try {
            const categories = await this.adminModel.getAllCategories();
            const parties = await this.adminModel.getAllParties();
            const niveaux = await this.adminModel.getAllNiveaux();

            let listCategories = [];

            if (categories?.data.length && parties?.data.length && niveaux?.data.length) {
                listCategories = categories.data.map(category => {
                    let metrique = niveaux.data.map(niveau => {
                        const partiesInCategory = this.filterPartiesByCategorie(category.id, parties.data)
                        const partiesInCategoryAndNiveau = this.filterPartiesByNiveau(niveau.id, partiesInCategory);
                        // console.log("Check matching", partiesInCategory, niveau)

                        const effectif = partiesInCategoryAndNiveau.length;
                        const proportion = (effectif * 100 / parties.data.length).toFixed(2);

                        return {
                            modalite: niveau.designation,
                            effectif: effectif,
                            proportion: proportion
                        };
                    });

                    return {
                        id: category.id,
                        title: category.designation,
                        metrique: metrique
                    };
                });
            }

            return res.json({ status: 200, message: 'Statistiques récupérées avec succès', data: listCategories });
        } catch (error) {
            return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
        }
    }

    filterPartiesByNiveau(niveauId, parties) {
        return parties.filter(partie => partie.id_level === niveauId);
    }

    filterPartiesByCategorie(categorieId, parties) {
        return parties.filter(partie =>  partie.id_categorie === categorieId);
    }
}

module.exports = AdminController;