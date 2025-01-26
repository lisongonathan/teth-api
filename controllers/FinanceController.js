const AuthController = require('./AuthController');
const FinanceModel = require('../models/FinanceModel');

class FinanceController extends AuthController {
  constructor() {
    super();
    this.financeModel = new FinanceModel();
  }

  async statistique(req, res) {
    try {
      const jetons = await this.financeModel.getAllJetons();
      const users = await this.financeModel.getVentesJetons();
      const niveaux = await this.financeModel.getAllNiveaux();
      
      let listJetons = [];

      if (jetons?.data.length) {
        listJetons = jetons.data.map(jeton => {
          let metrique = [];

          if (niveaux?.data.length) {
            metrique = niveaux.data.map(niveau => {
              const usersInNiveau = this.filterUsersByNiveau(niveau.id, users?.data || []);
              
              const usersWithJeton = usersInNiveau.filter(user => user.id_jeton === jeton.id);
              const effectif = usersWithJeton.length;
              const proportion = (effectif * 100 / (users?.data.length || 1)).toFixed(2);

              return {
                modalite: `${niveau.designation}`,
                effectif: effectif,
                proportion: proportion
              };
            });
          }

          return {
            id: jeton.id,
            title: `${jeton.designation} (${jeton.cote})`,
            metrique: metrique
          };
        });
      }

      return res.json({ status: 200, message: 'Statistiques récupérées avec succès', data: listJetons });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  filterUsersByNiveau(niveauId, users) {
    return users.filter(user => user.id_level === niveauId);
  }
}

module.exports = FinanceController;