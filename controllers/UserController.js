const AuthController = require('./AuthController');
const UserModel = require('../models/UserModel');

class UserController extends AuthController {
  constructor() {
    super();
    this.userModel = new UserModel();
  }
  async sessions(req, res) {
    const { id } = req.body;
    console.log(id)
    try {
      
      const result = await this.userModel.getUserSession(id);
      if (result?.data.length) {
        return res.json({ status: 200, message: 'Succès', data: result.data });

      } else {
        return res.status(404).json({ status: 404, message: 'Non trouvé' });

      }
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async splash(req, res) {
    try {
      const rules = await this.userModel.getAllUsers();
      this.sendResponse(res, 200, 'Règles récupérées avec succès', rules);
    } catch (error) {
      this.sendResponse(res, 500, 'Erreur lors de la récupération des règles', error);
    }
  }

  async agents(req, res) {
    try {
      const users = await this.userModel.getAllUsers();
      console.log(users)
      this.sendResponse(res, 200, 'Agents récupérés avec succès', users);
    } catch (error) {
      this.sendResponse(res, 500, 'Erreur lors de la récupération des agents', error);
    }
  }

  async sommeRebours(){
    let solde = 0.0;
    let totalCagnotes = 0.0;
    let totalMisesGagnees = 0.0;

    const cagnotes = await this.userModel.getAllCagnotes();
    const partiesGagnees = await this.userModel.getPartiesByStatus('OK');
    // console.log('raws parties', partiesGagnee"s);
    
    totalCagnotes += cagnotes.data.reduce((acc, cagnote) => acc + parseFloat(cagnote.amount), 0);      
    totalMisesGagnees += partiesGagnees.data.reduce((acc, partie) => acc + 2500, 0);

    // console.log("Total parties", totalMisesGagnees);

    solde += totalCagnotes - totalMisesGagnees;

    return solde;

  }

  async cagnote(req, res) {
    try {
      const solde = await this.sommeRebours();

      return res.json({ status: 200, message: 'Solde récupéré avec succès', solde });

    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async parties(req, res) {
    try {
      const partiesGagnees = await this.userModel.getPartiesByStatus('OK');
      const partiesEchouees = await this.userModel.getPartiesByStatus('NO');

      const nombrePartiesGagnees = partiesGagnees.data.length;
      const totalMisesGagnees = partiesGagnees.data.reduce((acc, partie) => acc + parseFloat(partie.mise), 0);

      const nombrePartiesEchouees = partiesEchouees.data.length;
      const totalMisesEchouees = partiesEchouees.data.reduce((acc, partie) => acc + parseFloat(partie.mise), 0);

      return res.json({
        status: 200,
        message: 'Parties récupérées avec succès',
        partiesGagnees: { nombre: nombrePartiesGagnees, solde: totalMisesGagnees },
        partiesEchouees: { nombre: nombrePartiesEchouees, solde: totalMisesEchouees }
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async users(req, res) {
    try {
      const users = await this.userModel.getAllUsers();

      const totalSolde = users.data.reduce((acc, user) => acc + parseFloat(user.solde), 0);
      const nombreUsers = users.data.length;

      return res.json({
        status: 200,
        message: 'Utilisateurs récupérés avec succès',
        nombreUsers,
        totalSolde,
        jouers: users.data
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async metrique(req, res) {
    const years = ['2024', '2025', '2026', '2027'];
    const monthAbbreviations = ['Janv.', 'Fév.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
    try {
      const metrics = {};

      for (const year of years) {
        metrics[year] = { won: {}, lost: {} };

        for (let month = 1; month <= 12; month++) {
          const monthStr = month.toString().padStart(2, '0');
          const startDate = `${year}-${monthStr}-01`;
          const endDate = `${year}-${monthStr}-31`;

          const wonGames = await this.userModel.getPartiesByStatusAndDate('OK', startDate, endDate);
          const lostGames = await this.userModel.getPartiesByStatusAndDate('NO', startDate, endDate);

          const monthAbbr = monthAbbreviations[month - 1];
          metrics[year].won[monthAbbr] = wonGames.data.length;
          metrics[year].lost[monthAbbr] = lostGames.data.length;
        }
      }

      return res.json({ status: 200, message: 'Métriques récupérées avec succès', data: metrics });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }
}

module.exports = UserController;
