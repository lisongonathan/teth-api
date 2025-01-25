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

  async cagnote(req, res) {
    try {
      let solde = 0.0;
      let totalCagnotes = 0.0;
      let totalMisesGagnees = 0.0;

      const cagnotes = await this.userModel.getAllCagnotes();
      const partiesGagnees = await this.userModel.getPartiesByStatus('OK');
      // console.log('raws parties', partiesGagnees);
      
      totalCagnotes += cagnotes.data.reduce((acc, cagnote) => acc + parseFloat(cagnote.amount), 0);      
      totalMisesGagnees += partiesGagnees.data.reduce((acc, partie) => acc + parseFloat(partie.mise), 0);

      // console.log("Total parties", totalMisesGagnees);

      solde += totalCagnotes - totalMisesGagnees;
            
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

      const totalSolde = users.reduce((acc, user) => acc + user.solde, 0);
      const nombreUsers = users.length;

      return res.json({
        status: 200,
        message: 'Utilisateurs récupérés avec succès',
        nombreUsers,
        totalSolde,
        users
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }
}

module.exports = UserController;
